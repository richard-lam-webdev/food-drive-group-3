// app/api/admin/orders/[id]/validate/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendDispatchEmail } from '@/lib/mailjetlivraison';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  // Extraction de l'identifiant de la commande depuis les paramètres de l'URL
  const orderId = parseInt(params.id);
  if (isNaN(orderId)) {
    return NextResponse.json({ error: 'Identifiant de commande invalide' }, { status: 400 });
  }

  try {
    // Récupérer la commande et les informations utilisateur associées
    const order = await prisma.commandes.findUnique({
      where: { id: orderId },
      include: {
        Utilisateurs: { select: { email: true } }
      }
    });
    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }
    if (order.statut !== 'payee') {
      return NextResponse.json(
        { error: 'Seules les commandes avec le statut "payee" peuvent être validées pour l’envoi' },
        { status: 400 }
      );
    }

    // Mettre à jour le statut de la commande en "expediee"
    const updatedOrder = await prisma.commandes.update({
      where: { id: orderId },
      data: { statut: 'expediee' }
    });

    // Envoyer un email de notification au client si l'email est présent
    if (order.Utilisateurs.email) {
      await sendDispatchEmail(order.Utilisateurs.email, updatedOrder.id);
    }

    return NextResponse.json({ message: 'Commande validée pour envoi', order: updatedOrder });
  } catch (error) {
    console.error('Erreur lors de la validation de la commande:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
