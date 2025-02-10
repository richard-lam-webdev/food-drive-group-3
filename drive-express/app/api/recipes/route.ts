import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const userId = parseInt(session.user.id.toString());

  try {
    const cart = await prisma.commandes.findFirst({
      where: { user_id: userId, statut: "panier" },
      include: { LignesCommandes: { include: { Produits: true } } },
    });

    if (!cart || cart.LignesCommandes.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const availableIngredients = cart.LignesCommandes.map(
      (line) => line.Produits.nom
    );

    const prompt = `
      J'ai les ingrédients suivants : ${availableIngredients.join(", ")}.
      Propose-moi une recette réalisable avec eux. 
      Si des ingrédients manquent, indique-les sous la forme :
      "Ingrédients manquants:
      [chaque ingrédient sur une ligne]"
      Puis, donne les instructions.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
      temperature: 0.7,
    });

    const recipeText = completion.choices[0].message.content.trim();

    // Extraction des ingrédients manquants depuis le texte généré
    let extractedMissingIngredients: string[] = [];
    if (recipeText.includes("Ingrédients manquants:")) {
      const splitMissing = recipeText.split("Ingrédients manquants:");
      if (splitMissing.length > 1) {
        const missingSection = splitMissing[1];
        // Si le texte contient une section d'instructions, on la sépare
        const splitInstructions = missingSection.split("Instructions:");
        const missingText = splitInstructions[0].trim();
        extractedMissingIngredients = missingText
          .split("\n")
          .map((line) =>
            line
              .trim()
              // Retirer les tirets, astérisques ou autres symboles de liste en début de ligne
              .replace(/^[-*]+\s*/, "")
          )
          .filter((line) => line !== "" && line !== "**");
      }
    }


    const savedRecipe = await prisma.recettesTemp.create({
      data: {
        user_id: userId,
        nom: "Recette suggérée",
        description: recipeText,
        ingredients: availableIngredients.join(", "),
        instructions: recipeText,
      },
    });

    return NextResponse.json({
      recipe: {
        ...savedRecipe,
        missingIngredients: extractedMissingIngredients,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération de la recette :", error);
    return NextResponse.json({ error: "Erreur lors de la génération" }, { status: 500 });
  }
}
