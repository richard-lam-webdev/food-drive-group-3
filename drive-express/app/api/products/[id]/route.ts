import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updatedProduct = await prisma.produits.update({
      where: { id: parseInt(params.id, 10) },
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
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du produit' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.produits.delete({
      where: { id: parseInt(params.id, 10) },
    });
    return NextResponse.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression du produit' }, { status: 500 });
  }
}

