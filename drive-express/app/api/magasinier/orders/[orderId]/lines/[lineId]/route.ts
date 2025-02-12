import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  context: { params: { orderId: string; lineId: string } }
) {
  // Attendre les paramètres avant de les utiliser
  const resolvedParams = await Promise.resolve(context.params);
  const { orderId, lineId } = resolvedParams;

  const session = await getServerSession(authOptions);
  if (!session || !["admin", "magasinier"].includes(session.user.role)) {
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
