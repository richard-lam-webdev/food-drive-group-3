import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string; lineId: string }> }
) {
  const { orderId, lineId } = await params;

  const session = await getServerSession(authOptions);
  if (!session || !session.user.role || !["admin", "magasinier"].includes(session.user.role)) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }

  try {
    const updatedLine = await prisma.lignesCommandes.update({
      where: { id: parseInt(lineId) },
      data: { flagged: true },
    });

    const lignes = await prisma.lignesCommandes.findMany({
      where: { order_id: parseInt(orderId) },
    });

    if (lignes.every((ligne) => ligne.flagged === true)) {
      await prisma.commandes.update({
        where: { id: parseInt(orderId) },
        data: { statut: "pretelivrable" },
      });
    }

    return NextResponse.json({ updatedLine });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la ligne de commande :", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
