import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
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
      numeroRue: "Rue admin",
      codePostal: "93000",
      ville: "Adminland",
      role: "admin",
    },
  });

  const categories = [
    "Fruits",
    "Légumes",
    "Viandes",
    "Poissons",
    "Produits Laitiers"
  ];
  
  for (const nom of categories) {
    await prisma.categories.upsert({
      where: { nom },
      update: {},
      create: { nom },
    });
  }

  const fruits = await prisma.categories.findUnique({ where: { nom: "Fruits" } });
  const legumes = await prisma.categories.findUnique({ where: { nom: "Légumes" } });
  const viandes = await prisma.categories.findUnique({ where: { nom: "Viandes" } });
  const poissons = await prisma.categories.findUnique({ where: { nom: "Poissons" } });
  const produitsLaitiers = await prisma.categories.findUnique({ where: { nom: "Produits Laitiers" } });

  await prisma.produits.createMany({
    data: [
      { nom: "Pomme", description: "Pommes rouges bio", prix: 1.2, quantite_stock: 50, categorie_id: fruits.id },
      { nom: "Banane", description: "Bananes mûres", prix: 1.4, quantite_stock: 60, categorie_id: fruits.id },
      { nom: "Orange", description: "Oranges juteuses", prix: 2.0, quantite_stock: 45, categorie_id: fruits.id },
      { nom: "Poire", description: "Poires fraîches", prix: 2.2, quantite_stock: 40, categorie_id: fruits.id },
      { nom: "Fraise", description: "Barquette de fraises", prix: 4.0, quantite_stock: 30, categorie_id: fruits.id },

      { nom: "Tomate", description: "Tomates bio", prix: 1.2, quantite_stock: 50, categorie_id: legumes.id },
      { nom: "Carotte", description: "Carottes fraîches", prix: 1.0, quantite_stock: 60, categorie_id: legumes.id },
      { nom: "Pomme de terre", description: "Pommes de terre jaunes", prix: 1.0, quantite_stock: 55, categorie_id: legumes.id },
      { nom: "Courgette", description: "Courgettes vertes", prix: 2.0, quantite_stock: 40, categorie_id: legumes.id },
      { nom: "Salade", description: "Laitue fraîche", prix: 1.2, quantite_stock: 35, categorie_id: legumes.id },

      { nom: "Poulet", description: "Blanc de volaille", prix: 6.0, quantite_stock: 25, categorie_id: viandes.id },
      { nom: "Bœuf", description: "Steak de bœuf", prix: 10.0, quantite_stock: 20, categorie_id: viandes.id },
      { nom: "Porc", description: "Côte de porc", prix: 8.0, quantite_stock: 25, categorie_id: viandes.id },
      { nom: "Dinde", description: "Filet de dinde", prix: 7.5, quantite_stock: 30, categorie_id: viandes.id },
      { nom: "Agneau", description: "Carré d'agneau", prix: 12.0, quantite_stock: 15, categorie_id: viandes.id },

      { nom: "Saumon", description: "Pavé de saumon", prix: 15.0, quantite_stock: 20, categorie_id: poissons.id },
      { nom: "Thon", description: "Boîte de thon", prix: 3.5, quantite_stock: 40, categorie_id: poissons.id },
      { nom: "Crevettes", description: "Crevettes décortiquées", prix: 12.0, quantite_stock: 25, categorie_id: poissons.id },
      { nom: "Sardines", description: "Sardines en boîte", prix: 2.5, quantite_stock: 50, categorie_id: poissons.id },
      { nom: "Morue", description: "Filet de morue", prix: 14.0, quantite_stock: 20, categorie_id: poissons.id },

      { nom: "Lait", description: "Lait entier", prix: 1.5, quantite_stock: 60, categorie_id: produitsLaitiers.id },
      { nom: "Fromage", description: "Fromage cheddar", prix: 3.5, quantite_stock: 30, categorie_id: produitsLaitiers.id },
      { nom: "Yaourt", description: "Yaourt nature", prix: 1.5, quantite_stock: 50, categorie_id: produitsLaitiers.id },
      { nom: "Beurre", description: "Beurre doux", prix: 2.0, quantite_stock: 40, categorie_id: produitsLaitiers.id },
      { nom: "Crème", description: "Crème fraîche", prix: 2.5, quantite_stock: 35, categorie_id: produitsLaitiers.id },
    ],
    skipDuplicates: true, 
  });

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erreur lors de l'exécution du seed :", e);
    await prisma.$disconnect();
    process.exit(1);
  });
