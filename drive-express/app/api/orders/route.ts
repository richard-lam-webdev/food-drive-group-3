import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET : Récupérer les commandes de l'utilisateur (hors statut "panier")
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const userId = parseInt(session.user.id.toString());
  
  const orders = await prisma.commandes.findMany({
    where: {
      user_id: userId,
      NOT: { statut: "panier" },
    },
    include: {
      LignesCommandes: {
        include: { Produits: true },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  
  return NextResponse.json({ orders });
}
