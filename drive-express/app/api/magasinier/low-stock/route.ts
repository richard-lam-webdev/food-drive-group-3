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
  const stock = 10;
  const products = await prisma.produits.findMany({
    where: { quantite_stock: { lt: stock } },
    select: { id: true, nom: true, quantite_stock: true },
  });
  return NextResponse.json({ products });
}
