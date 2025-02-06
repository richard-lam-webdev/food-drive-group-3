import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // Récupérer la catégorie depuis l'URL

    let products;

    if (category) {
      // Récupérer les produits d'une catégorie spécifique
      products = await prisma.produits.findMany({
        where: {
          Categories: {
            nom: category, // Filtre par nom de catégorie
          },
        },
        include: { Categories: true }, // Inclure les détails de la catégorie
      });
    } else {
      // Récupérer tous les produits
      products = await prisma.produits.findMany({
        include: { Categories: true },
      });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Erreur API /products :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Trouver l'ID de la catégorie à partir de son nom
    const category = await prisma.categories.findUnique({
      where: { nom: body.categorie_nom },
    });

    if (!category) {
      return NextResponse.json(
        { error: "La catégorie spécifiée n'existe pas" },
        { status: 400 }
      );
    }

    const product = await prisma.produits.create({
      data: {
        nom: body.nom,
        description: body.description,
        prix: parseFloat(body.prix),
        quantite_stock: parseInt(body.quantite_stock, 10),
        categorie_id: category.id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erreur POST:", error);
    return NextResponse.json(
      { error: "Erreur lors de l’ajout du produit" },
      { status: 500 }
    );
  }
}
