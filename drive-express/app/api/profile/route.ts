
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
export async function GET(req: Request) {
  
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }


  const user = await prisma.utilisateurs.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
  }


  const profile = {
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    adresse: {
      numeroRue: user.numeroRue,
      codePostal: user.codePostal,
      ville: user.ville
    }
  };

  return NextResponse.json(profile);
}
