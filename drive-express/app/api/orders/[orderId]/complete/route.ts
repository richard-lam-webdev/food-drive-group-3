import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: { orderId: string } }) {
  const orderId = parseInt(params.orderId);
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "client") {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }

  try {
    const updatedOrder = await prisma.commandes.update({
      where: { id: orderId },
      data: { statut: "traite" },
    });
    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("Erreur lors de la finalisation de la commande :", error);
    return NextResponse.json({ error: "Erreur lors de la finalisation" }, { status: 500 });
  }
}
