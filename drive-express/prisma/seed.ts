import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Créer un admin et un client test avec des mots de passe en clair
  const adminPassword = 'admin123';
  const clientPassword = 'client123';

  // Ajouter un utilisateur admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@drive-express.fr' },
    update: {},
    create: {
      email: 'admin@drive-express.fr',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Ajouter un utilisateur client
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      password: clientPassword,
      role: Role.CLIENT,
    },
  });

  // Créer des catégories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Fruits & Légumes' },
      update: {},
      create: {
        name: 'Fruits & Légumes',
        description: 'Produits frais de saison',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Produits Laitiers' },
      update: {},
      create: {
        name: 'Produits Laitiers',
        description: 'Lait, fromages, yaourts...',
      },
    }),
  ]);

  // Créer des produits pour chaque catégorie
  for (const category of categories) {
    await prisma.product.createMany({
      skipDuplicates: true,
      data: [
        {
          name: `Produit 1 - ${category.name}`,
          description: 'Description du produit 1',
          price: 9.99,
          stock: 100,
          categoryId: category.id,
        },
        {
          name: `Produit 2 - ${category.name}`,
          description: 'Description du produit 2',
          price: 19.99,
          stock: 50,
          categoryId: category.id,
        },
      ],
    });
  }

  console.log('Base de données initialisée avec succès');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
