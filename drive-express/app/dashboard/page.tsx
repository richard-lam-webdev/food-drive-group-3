'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
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
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white h-screen p-6">
        <h1 className="text-2xl font-bold mb-6">Drive Express</h1>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link href="/dashboard" className="hover:text-green-400">
                📊 Tableau de bord
              </Link>
            </li>
            <li>
              <Link href="/dashboard/utilisateurs" className="hover:text-green-400">
                👥 Utilisateurs
              </Link>
            </li>
            <li>
              <Link href="/dashboard/produits" className="hover:text-green-400">
                📦 Produits
              </Link>
            </li>
            <li>
              <Link href="/dashboard/categories" className="hover:text-green-400">
                🗂️ Catégories
              </Link>
            </li>
            <li>
              <Link href="/dashboard/commandes" className="hover:text-green-400">
                🛒 Commandes
              </Link>
            </li>
            <li>
              <Link href="/dashboard/statistiques" className="hover:text-green-400">
                📈 Statistiques
              </Link>
            </li>
            <li>
              <Link href="/dashboard/parametres" className="hover:text-green-400">
                ⚙️ Paramètres
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenu principal */}
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
    </div>
  );
}
