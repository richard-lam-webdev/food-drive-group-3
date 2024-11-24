import 'dotenv/config'; // Ajout pour charger les variables
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const utilisateurs = await prisma.utilisateurs.findMany();
    console.log('Utilisateurs existants :', utilisateurs);
}

main()
    .catch((e) => {
        console.error('Erreur :', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
