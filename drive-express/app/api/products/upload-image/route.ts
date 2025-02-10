import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, 
  },
};

export async function POST(request: Request) {
  try {
    // Utilisation de request.formData() pour récupérer le formulaire
    const formData = await request.formData();
    const productId = formData.get("productId");
    const file = formData.get("image") as File;

    if (!productId || !file) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // Créer le répertoire de destination (public/produits) s'il n'existe pas déjà
    const destDir = path.join(process.cwd(), 'public', 'produits');
    await fs.mkdir(destDir, { recursive: true });

    // Définir le chemin de destination public/produits/{productId}.png
    const destPath = path.join(destDir, `${productId}.png`);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Écrire le fichier sur le disque
    await fs.writeFile(destPath, buffer);

    return NextResponse.json({ message: 'Image téléchargée avec succès' });
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image :", error);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement du fichier" }, { status: 500 });
  }
}
