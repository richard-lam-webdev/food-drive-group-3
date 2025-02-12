'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

// Définir le type des statistiques
interface DashboardStats {
  totalCommandes: number;
  chiffreAffaires: number;
  produitsEnStock: number;
  nouveauxUtilisateurs: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const data: DashboardStats = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur de récupération des stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (status === 'loading') {
    return <p>Chargement...</p>;
  }

  if (!session || session.user.role !== 'admin') {
    return <p>Accès refusé. Veuillez vous connecter en tant qu’administrateur.</p>;
  }

  return (
    <main className="flex-1 p-8 bg-gray-50">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Vue d&apos;ensemble</h2>
      </header>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-green-100 rounded shadow">
          <h3 className="font-bold text-green-700">Commandes</h3>
          <p className="text-2xl font-bold">{stats?.totalCommandes || 0}</p>
        </div>
        <div className="p-4 bg-green-100 rounded shadow">
          <h3 className="font-bold text-green-700">Chiffre d&apos;affaires</h3>
          <p className="text-2xl font-bold">{stats?.chiffreAffaires || 0} €</p>
        </div>
        <div className="p-4 bg-green-100 rounded shadow">
          <h3 className="font-bold text-green-700">Produits en stock</h3>
          <p className="text-2xl font-bold">{stats?.produitsEnStock || 0}</p>
        </div>
        <div className="p-4 bg-green-100 rounded shadow">
          <h3 className="font-bold text-green-700">Nouveaux utilisateurs</h3>
          <p className="text-2xl font-bold">{stats?.nouveauxUtilisateurs || 0}</p>
        </div>
      </div>
    </main>
  );
}