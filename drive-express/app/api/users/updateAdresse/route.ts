import { authOptions } from "@/lib/authOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {

  const session = await getServerSession(authOptions);

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