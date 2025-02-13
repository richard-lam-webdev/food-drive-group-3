import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const numericOrderId = parseInt(orderId);
  
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "client") {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }

  try {
    const updatedOrder = await prisma.commandes.update({
      where: { id: numericOrderId },
      data: { statut: "traite" },
    });
    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("Erreur lors de la finalisation :", error);
    return NextResponse.json(
      { error: "Échec de la finalisation" }, 
      { status: 500 }
    );
  }
}