import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assurez-vous d'avoir une instance Prisma dans ce fichier

export async function GET() {
  try {
    // Récupérer toutes les commandes (toutes, ou vous pouvez exclure celles en "panier")
    const orders = await prisma.commandes.findMany({
      // Pour l'admin, vous pouvez afficher toutes les commandes
      where: {
        // Par exemple, pour exclure uniquement le panier :
        NOT: { statut: "panier" },
      },
      include: {
        // Inclure les lignes de commande avec les informations des produits
        LignesCommandes: {
          include: {
            Produits: {
              select: {
                nom: true,
              },
            },
          },
        },
        // Inclure quelques informations sur l'utilisateur
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
