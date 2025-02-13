import { NextRequest, NextResponse } from 'next/server';import prisma from '@/lib/prisma';
import { sendDispatchEmail } from '@/lib/mailjetlivraison';


type Params = {
  id: string;
};

interface OrderWithUser {
  id: number;
  statut: string;
  Utilisateurs: { email: string } | null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const orderId = parseInt(id);
  if (isNaN(orderId)) {
    return NextResponse.json({ error: 'Identifiant de commande invalide' }, { status: 400 });
  }

  try {
    const order = await prisma.commandes.findUnique({
      where: { id: orderId },
      include: { Utilisateurs: { select: { email: true } }
    } }) as unknown as OrderWithUser | null;

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' }, 
        { status: 404 }
      );
    }

    if (order.statut !== 'payee') {
      return NextResponse.json(
        { error: 'Statut de commande invalide pour validation' }, 
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.commandes.update({
      where: { id: orderId },
      data: { statut: 'expediee' }
    });

    if (order.Utilisateurs?.email) {
      await sendDispatchEmail(
        order.Utilisateurs.email,
        updatedOrder.id
      );
    }

    return NextResponse.json({ 
      message: 'Commande validée avec succès', 
      data: updatedOrder 
    });

  } catch (error) {
    console.error('Erreur lors de la validation de la commande:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
