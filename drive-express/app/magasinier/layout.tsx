import Link from "next/link";

export default function MagasinierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-green-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-6">Drive Express - Magasinier</h1>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link href="/magasinier/dashboard" className="hover:text-green-400">
                📊 Tableau de bord
              </Link>
            </li>
            <li>
              <Link href="/magasinier/produits" className="hover:text-green-400">
                📦 Produits
              </Link>
            </li>
            <li>
              <Link href="/magasinier/categories" className="hover:text-green-400">
                🗂 Catégories
              </Link>
            </li>
            <li>
              <Link href="/magasinier/orders" className="hover:text-green-400">
                🛒 Commandes
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
