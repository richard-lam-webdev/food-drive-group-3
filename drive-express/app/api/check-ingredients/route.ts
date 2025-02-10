import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json({ error: "Liste d'ingrédients invalide" }, { status: 400 });
    }

    // retire le contenu entre parenthèses, trim, et mettre en minuscules
    const normalizedIngredients = ingredients.map((ing: string) =>
      ing.replace(/\s*\(.*?\)\s*/g, "").trim().toLowerCase()
    );

    // récupère tous les produits
    const allProducts = await prisma.produits.findMany({
      select: { id: true, nom: true, quantite_stock: true },
    });

    // filtre en mémoire : pour chaque produit on vérifie si son nom normalisé contient l'un des ingrédients normalisés.
    const matchingProducts = allProducts.filter(product => {
      const normalizedProductName = product.nom.toLowerCase().trim();
      return normalizedIngredients.some(normIng => normalizedProductName.includes(normIng));
    });

    return NextResponse.json({
      availableIngredients: matchingProducts
    });
  } catch (error) {
    console.error("Erreur lors de la vérification des ingrédients :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
