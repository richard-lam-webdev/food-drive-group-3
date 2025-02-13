import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/lib/authOptions"; 
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.utilisateurs.findUnique({
      where: { email: session.user.email },
      select: {
        numeroRue: true,
        codePostal: true,
        ville: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'adresse :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'adresse" },
      { status: 500 }
    );
  }
}
