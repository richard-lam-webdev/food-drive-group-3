import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);
    
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'ID produit invalide' }, { status: 400 });
    }

    const product = await prisma.produits.findUnique({
      where: { id: productId },
    });

    return product 
      ? NextResponse.json(product)
      : NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
      
  } catch (error) {
    console.error('Erreur GET produit:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);
    const body = await req.json();

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'ID produit invalide' }, { status: 400 });
    }

    const updatedProduct = await prisma.produits.update({
      where: { id: productId },
      data: {
        nom: body.nom,
        description: body.description,
        prix: parseFloat(body.prix),
        quantite_stock: parseInt(body.quantite_stock, 10),
        categorie_id: parseInt(body.categorie_id, 10),
      },
    });

    return NextResponse.json(updatedProduct);

  } catch (error) {
    console.error('Erreur PUT produit:', error);
    return NextResponse.json(
      { error: 'Échec mise à jour produit' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'ID produit invalide' }, { status: 400 });
    }

    await prisma.produits.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: 'Produit supprimé avec succès' });

  } catch (error) {
    console.error('Erreur DELETE produit:', error);
    return NextResponse.json(
      { error: 'Échec suppression produit' }, 
      { status: 500 }
    );
  }
}