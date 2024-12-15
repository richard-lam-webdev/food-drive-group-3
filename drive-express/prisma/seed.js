import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Démarrage du seed générique...");

  // Création de l'admin par défaut
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.utilisateurs.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      nom: "ADMIN",
      prenom: "Super",
      adresse: "Adresse Admin",
      role: "admin",
    },
  });
  console.log("✅ Admin créé avec succès !");

  // Création des catégories
  const categories = ["Fruits", "Légumes", "Boissons", "Épicerie"];
  for (const nom of categories) {
    await prisma.categories.upsert({
      where: { nom },
      update: {},
      create: { nom },
    });
  }
  console.log("✅ Catégories ajoutées avec succès !");

  // Récupération des IDs des catégories
  const fruits = await prisma.categories.findUnique({ where: { nom: "Fruits" } });
  const legumes = await prisma.categories.findUnique({ where: { nom: "Légumes" } });
  const boissons = await prisma.categories.findUnique({ where: { nom: "Boissons" } });

  // Création de produits par défaut
  await prisma.produits.createMany({
    data: [
      {
        nom: "Pomme",
        description: "Délicieuse pomme rouge",
        prix: 1.5,
        quantite_stock: 50,
        categorie_id: fruits.id,
      },
      {
        nom: "Banane",
        description: "Banane riche en potassium",
        prix: 2.0,
        quantite_stock: 100,
        categorie_id: fruits.id,
      },
      {
        nom: "Carotte",
        description: "Carotte bio fraîche",
        prix: 0.99,
        quantite_stock: 80,
        categorie_id: legumes.id,
      },
      {
        nom: "Jus d'orange",
        description: "Pur jus d'orange sans sucre ajouté",
        prix: 3.5,
        quantite_stock: 30,
        categorie_id: boissons.id,
      },
    ],
    skipDuplicates: true, // Ignore les doublons
  });
  console.log("✅ Produits ajoutés avec succès !");
}

main()
  .then(async () => {
    console.log("🌱 Seed terminé avec succès !");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erreur lors de l'exécution du seed :", e);
    await prisma.$disconnect();
    process.exit(1);
  });
