import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

export async function GET() {
  try {
    const orders = await prisma.commandes.findMany({
      where: {
        NOT: { statut: "panier" },
      },
      include: {
        LignesCommandes: {
          include: {
            Produits: {
              select: {
                nom: true,
              },
            },
          },
        },
        Utilisateurs: {
          select: {
            email: true,
            nom: true,
            prenom: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes" },
      { status: 500 }
    );
  }
}
