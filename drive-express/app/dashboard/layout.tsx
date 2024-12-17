// app/dashboard/layout.tsx
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-green-900 text-white p-6">
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
                🗂 Catégories
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

      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
