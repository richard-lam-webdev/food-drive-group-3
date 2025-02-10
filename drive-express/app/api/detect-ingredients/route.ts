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
      return new Response(JSON.stringify({ error: "Aucune image fournie" }), { status: 400 });
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
        { role: "system", content: "Tu es un assistant qui identifie les ingrédients." },
        {
          role: "user",
          content: [
            { type: "text", text: "Liste uniquement les ingrédients présents sur cette image, sans phrases explicatives." },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${fs.readFileSync(filePath, "base64")}` } },
          ],
        },
      ],
      max_tokens: 200,
    });

    const detectedIngredients = response.choices[0]?.message?.content
      ?.split("\n")
      .map((item) => item.replace(/^\d+\.\s*/, "").trim()) // Nettoyage des numéros
      .filter(Boolean);

    const existingIngredients = await prisma.produits.findMany({
      where: { nom: { in: detectedIngredients } },
      select: { nom: true },
    });

    const foundIngredients = existingIngredients.map((item) => item.nom);
    const missingIngredients = detectedIngredients.filter((ing) => !foundIngredients.includes(ing));

    return new Response(
      JSON.stringify({ foundIngredients, missingIngredients }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur API OpenAI :", error);
    return new Response(JSON.stringify({ error: "Erreur lors de la détection" }), { status: 500 });
  }
}
