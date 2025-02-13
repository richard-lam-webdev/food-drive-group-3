import { prisma } from "@/lib/db";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import path from "path";
import sharp from "sharp";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    // 1. Récupération du formulaire et du fichier image
    const formData = await req.formData();
    const file = formData.get("image") as File;
    if (!file) {
      return NextResponse.json({ error: "Aucune image fournie" }, { status: 400 });
    }

    // 2. Sauvegarde temporaire de l'image dans public/uploads
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, file.name);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(filePath, buffer);

    // 3. Redimensionnement de l'image avec Sharp (exemple : largeur maximale de 256px)
    const resizedBuffer = await sharp(buffer)
      .resize({ width: 256, withoutEnlargement: true })
      .toBuffer();

    // 4. Conversion asynchrone en base64 via fs.promises (ou directement depuis resizedBuffer)
    const base64Image = resizedBuffer.toString("base64");
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    // 5. Suppression du fichier temporaire
    await fs.promises.unlink(filePath);

    // 6. Création de l'instance OpenAI
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // 7. Construction d'un prompt amélioré pour obtenir un JSON structuré
    const prompt = `Vous êtes un assistant expert en reconnaissance d'ingrédients.
Lorsque vous recevez une image sous forme d'URL base64, analysez-la et renvoyez exactement un JSON structuré au format suivant (aucun texte additionnel) :
{
  "ingredients": ["ingredient1", "ingredient2", ...]
}
Liste uniquement les ingrédients présents sur l'image.`;

    // 8. Appel à l'API OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "Vous êtes un assistant expert en reconnaissance d'ingrédients." },
        { role: "user", content: prompt + "\nImage: " + imageUrl },
      ],
      max_tokens: 200,
    });

    // 9. Extraction et parsing du résultat JSON
    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent) {
      return NextResponse.json({ error: "Aucune réponse de l'IA" }, { status: 500 });
    }

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseContent);
    } catch (parseError) {
      console.error("Erreur lors du parsing du JSON :", parseError);
      return NextResponse.json({ error: "Erreur lors du parsing du JSON" }, { status: 500 });
    }

    // 10. Extraction des ingrédients détectés
    const detectedIngredients = Array.isArray(jsonResponse.ingredients)
      ? jsonResponse.ingredients
      : [];

    // 11. Vérification des ingrédients existants en base
    const existingIngredients = await prisma.produits.findMany({
      where: { nom: { in: detectedIngredients } },
      select: { nom: true },
    });
    const foundIngredients = existingIngredients.map((item) => item.nom);
    const missingIngredients = detectedIngredients.filter(
      (ing) => !foundIngredients.includes(ing)
    );

    // 12. Renvoi de la réponse JSON structurée
    return NextResponse.json(
      { foundIngredients, missingIngredients },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur API OpenAI :", error);
    return NextResponse.json(
      { error: "Erreur lors de la détection" },
      { status: 500 }
    );
  }
}
