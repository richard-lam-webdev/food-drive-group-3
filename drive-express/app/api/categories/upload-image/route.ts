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
    const formData = await request.formData();
    const categoryId = formData.get("categoryId") as string;
    const file = formData.get("image") as File;
    if (!categoryId || !file) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }
    const destDir = path.join(process.cwd(), 'public', 'categories');
    await fs.mkdir(destDir, { recursive: true });
    const destPath = path.join(destDir, `${categoryId}.png`);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(destPath, buffer);
    return NextResponse.json({ message: 'Image téléchargée avec succès' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de l\'enregistrement du fichier' }, { status: 500 });
  }
}
