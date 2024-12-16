import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.utilisateurs.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Erreur API GET users:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des utilisateurs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const user = await prisma.utilisateurs.create({
      data: {
        nom: body.nom,
        email: body.email,
        role: body.role,
        password: hashedPassword,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur API POST users:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l’utilisateur' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const user = await prisma.utilisateurs.update({
      where: { id: body.id },
      data: {
        nom: body.name,
        email: body.email,
        role: body.role,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de l’utilisateur' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    await prisma.utilisateurs.delete({
      where: { id: body.id },
    });
    return NextResponse.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression de l’utilisateur' }, { status: 500 });
  }
}
