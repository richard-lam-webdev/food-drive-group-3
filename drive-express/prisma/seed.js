import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  const password = "admin123"; 
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.utilisateurs.findUnique({
    where: { email },
  });

  if (!existingAdmin) {
    await prisma.utilisateurs.create({
      data: {
        email,
        password: hashedPassword,
        nom: "ADMIN",
        prenom: "Admin",
        adresse: "Adresse Admin",
        role: "admin", 
      },
    });
    console.log("Admin créé avec succès !");
  } else {
    console.log("Un admin avec cet email existe déjà.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Erreur lors de l'exécution du seed :", e);
    await prisma.$disconnect();
    process.exit(1);
  });
