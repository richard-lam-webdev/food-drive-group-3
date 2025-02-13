import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, nom, prenom } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.utilisateurs.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        role: "client",
      },
    });
    return new Response(JSON.stringify({ message: "Utilisateur créé avec succès", user }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Erreur lors de l'inscription" }), {
      status: 400,
    });
  }
}
