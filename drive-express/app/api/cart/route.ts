import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma"; 

interface CartItem {
  id: number;
  quantite: number;
  prix: number;
}

interface CartRequest {
  cartItems: CartItem[];
}

export async function GET() { 
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = Number(session.user.id);
  
  try {
    const panier = await prisma.commandes.findFirst({
      where: { 
        user_id: userId, 
        statut: "panier" 
      },
      include: { 
        LignesCommandes: { 
          include: { Produits: true }
        }
      },
    });

    return NextResponse.json({ panier });
  } catch (error) {
    console.error("Erreur de récupération du panier:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = Number(session.user.id);
  
  try {
    const { cartItems } = await request.json() as CartRequest;

    if (!Array.isArray(cartItems)) {
      return NextResponse.json(
        { error: "Format de données invalide" },
        { status: 400 }
      );
    }

    let panier = await prisma.commandes.findFirst({
      where: { user_id: userId, statut: "panier" },
    });

    if (!panier) {
      panier = await prisma.commandes.create({
        data: {
          user_id: userId,
          total: 0,
          statut: "panier",
        },
      });
    }

    await prisma.$transaction([
      prisma.lignesCommandes.deleteMany({
        where: { order_id: panier.id },
      }),
      prisma.lignesCommandes.createMany({
        data: cartItems.map((item) => ({
          order_id: panier.id,
          product_id: item.id,
          quantite: item.quantite,
          prix_unitaire: item.prix,
        })),
      }),
    ]);

    const total = cartItems.reduce(
      (acc, item) => acc + item.prix * item.quantite,
      0
    );

    const updatedPanier = await prisma.commandes.update({
      where: { id: panier.id },
      data: { total },
      include: {
        LignesCommandes: {
          include: { Produits: true }
        }
      }
    });

    return NextResponse.json({ panier: updatedPanier });
  } catch (error) {
    console.error("Erreur de mise à jour du panier:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE() { 
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = Number(session.user.id);
  
  try {
    await prisma.commandes.deleteMany({
      where: { user_id: userId, statut: "panier" },
    });

    return NextResponse.json({ message: "Panier vidé avec succès" });
  } catch (error) {
    console.error("Erreur de suppression du panier:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}