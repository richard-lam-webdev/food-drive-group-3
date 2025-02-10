// app/api/cart/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET : Charger le panier de l'utilisateur (uniquement si statut === "panier")
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const userId = parseInt(session.user.id.toString());
  const panier = await prisma.commandes.findFirst({
    where: { user_id: userId, statut: "panier" },
    include: { 
      LignesCommandes: { 
        include: { Produits: true }
      }
    },
  });
  return NextResponse.json({ panier });
}

// POST : Créer ou mettre à jour le panier
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { cartItems } = await request.json();
  const userId = parseInt(session.user.id.toString());

  let panier = await prisma.commandes.findFirst({
    where: { user_id: userId, statut: "panier" },
  });
  if (!panier) {
    panier = await prisma.commandes.create({
      data: {
        user_id: userId,
        total: 0, // sera recalculé ci-après
        statut: "panier", // nouveau statut pour un panier non finalisé
      },
    });
  }

  // Supprimer les anciennes lignes du panier
  await prisma.lignesCommandes.deleteMany({
    where: { order_id: panier.id },
  });

  // Créer les nouvelles lignes du panier
  const newLignes = cartItems.map((item: any) => ({
    order_id: panier.id,
    product_id: item.id,
    quantite: item.quantite,
    prix_unitaire: item.prix,
  }));
  await prisma.lignesCommandes.createMany({ data: newLignes });

  // Calculer et mettre à jour le total
  const total = cartItems.reduce((acc: number, item: any) => acc + item.prix * item.quantite, 0);
  await prisma.commandes.update({
    where: { id: panier.id },
    data: { total },
  });

  return NextResponse.json({ panier });
}

// DELETE : Vider le panier
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const userId = parseInt(session.user.id.toString());
  await prisma.commandes.deleteMany({
    where: { user_id: userId, statut: "panier" },
  });
  return NextResponse.json({ message: "Panier vidé" });
}
