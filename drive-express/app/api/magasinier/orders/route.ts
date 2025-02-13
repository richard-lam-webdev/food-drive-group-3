// app/api/magasinier/orders/route.ts
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.role || !["admin", "magasinier"].includes(session.user.role)) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }
  const orders = await prisma.commandes.findMany({
    where: { statut: { notIn: ["panier", "en_cours_de_paiement"] } },
    include: {
      LignesCommandes: {
        include: { Produits: true },
      },
      Utilisateurs: {
        select: { email: true },
      },
    },
    orderBy: { created_at: "desc" },
  });
  return NextResponse.json({ orders });
}
