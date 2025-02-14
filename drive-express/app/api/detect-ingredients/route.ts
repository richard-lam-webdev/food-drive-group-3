import { prisma } from "@/lib/db";
import fs from "fs";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import path from "path";
import { promisify } from "util";

export const config = {
  api: {
    bodyParser: false,
  },
};

const writeFile = promisify(fs.writeFile);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "Aucune image fournie" }),
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", 
          content: 
          "Tu es un assistant expert en reconnaissance visuelle des ingrédients alimentaires. L'image fournie contient un plat cuisiné. \
          Ton objectif est d'identifier UNIQUEMENT les ingrédients visibles. \
          **Ne devine pas** : si un ingrédient n'est pas visible, ne l'ajoute pas. \
          **Ne formate pas la réponse avec des balises Markdown.** \
          **Ne rajoute aucun texte explicatif.** \
          **Retourne TOUS les ingrédients détectés au format JSON avec les règles suivantes :** \
          - **Écris les noms des ingrédients avec une majuscule en première lettre.** \
          - **Utilise toujours le singulier.** \
          - **Ne mets aucun texte en dehors du JSON.** \
          Réponds STRICTEMENT avec un JSON valide sous cette forme : { \"foundIngredients\": string[], \"missingIngredients\": string[] }." },
        {
          role: "user",
          content: [
            { type: "text", text:  "Tu es un expert en reconnaissance visuelle des aliments. L'image fournie représente un plat cuisiné contenant plusieurs ingrédients visibles. \
              Ton objectif est d'identifier UNIQUEMENT les ingrédients clairement présents. \
              **Ne devine pas** : si un ingrédient n'est pas visible, ne l'ajoute pas. \
              Retourne un JSON STRICTEMENT formaté sous cette forme : { \"foundIngredients\": string[], \"missingIngredients\": string[] }. \
              Ne mets **aucun texte explicatif en dehors du JSON**.", },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${fs.readFileSync(filePath, "base64")}` } },
          ],
        },
      ],
      max_tokens: 200,
    });

    const openaiResponse = response.choices[0]?.message?.content || "";

    let jsonResult;
    try {
      jsonResult = JSON.parse(openaiResponse);
    } catch (e) {
      console.error("❌ Erreur lors du parsing JSON :", e);
      return new Response(
        JSON.stringify({ error: "Réponse invalide du modèle", openaiResponse }),
        { status: 500 }
      );
    }

    const { foundIngredients, missingIngredients } = jsonResult;

    const existingIngredients = await prisma.produits.findMany({
      where: { nom: { in: foundIngredients } },
      select: { nom: true },
    });

    const foundInDb = existingIngredients.map((item) => item.nom);

    const allIngredientsInDb = await prisma.produits.findMany({
      select: { nom: true },
    });

    const allPossibleIngredients = allIngredientsInDb.map((item) => item.nom);

    const missingFromDb = foundIngredients.filter(
      (ingredient) => !allPossibleIngredients.includes(ingredient)
    );

    return new Response(
      JSON.stringify({ foundIngredients: foundInDb, missingIngredients: missingFromDb }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur API OpenAI :", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la détection" }),
      { status: 500 }
    );
  }
}
