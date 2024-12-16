import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Récupération des statistiques globales
    const totalCommandes = await prisma.commandes.count();
    const chiffreAffaires = await prisma.commandes.aggregate({
      _sum: { total: true },
    });
    const produitsEnStock = await prisma.produits.aggregate({
      _sum: { quantite_stock: true },
    });
    const nouveauxUtilisateurs = await prisma.utilisateurs.count({
      where: {
        created_at: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Derniers 30 jours
        },
      },
    });

    const categoriesPopulaires = await prisma.categories.findMany({
      orderBy: {
        Produits: { _count: 'desc' },
      },
      take: 5,
      select: {
        nom: true,
        _count: { select: { Produits: true } },
      },
    });

    return NextResponse.json({
      totalCommandes,
      chiffreAffaires: chiffreAffaires._sum.total || 0,
      produitsEnStock: produitsEnStock._sum.quantite_stock || 0,
      nouveauxUtilisateurs,
      categoriesPopulaires,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
