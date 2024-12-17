'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();

  // États pour les statistiques
  const [stats, setStats] = useState<any>(null);

  // Fetch statistiques
  const fetchStats = async () => {
    const res = await fetch('/api/dashboard');
    const data = await res.json();
    setStats(data);
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
        <h2 className="text-3xl font-bold">Vue d'ensemble</h2>
      </header>

      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-green-100 rounded shadow">
          <h3 className="font-bold text-green-700">Commandes</h3>
          <p className="text-2xl font-bold">{stats?.totalCommandes || 0}</p>
        </div>
        <div className="p-4 bg-green-100 rounded shadow">
          <h3 className="font-bold text-green-700">Chiffre d'affaires</h3>
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
