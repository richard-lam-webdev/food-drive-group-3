import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  // Vérifier que les cookies sont reçus
  console.log("Cookies reçus :", request.headers.get("cookie"));

  const session = await getServerSession(authOptions);
  console.log("Session récupérée :", session);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { numeroRue, codePostal, ville, saveAddress } = await request.json();

  if (!saveAddress) {
    return NextResponse.json({ message: "Aucune mise à jour effectuée" });
  }

  try {
    const updatedUser = await prisma.utilisateurs.update({
      where: { email: session.user.email },
      data: { numeroRue, codePostal, ville },
    });
    return NextResponse.json({
      message: "Adresse mise à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'adresse :", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'adresse" },
      { status: 500 }
    );
  }
}