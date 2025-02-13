import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> } 
) {
  const { orderId } = await params;
  
  const session = await getServerSession(authOptions);
  if (!session || !session.user.role || !["admin", "magasinier"].includes(session.user.role)) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }
  
  try {
    const updatedOrder = await prisma.commandes.update({
      where: { id: parseInt(orderId) },
      data: { statut: "complete" },
    });
    
    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande :", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
