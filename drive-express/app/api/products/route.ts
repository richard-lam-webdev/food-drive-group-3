import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await prisma.produits.findMany();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération des produits' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await prisma.produits.create({
      data: {
        nom: body.nom,
        description: body.description,
        prix: parseFloat(body.prix),
        quantite_stock: parseInt(body.quantite_stock, 10),
        categorie_id: parseInt(body.categorie_id, 10),
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l’ajout du produit' }, { status: 500 });
  }
}

