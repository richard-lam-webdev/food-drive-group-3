"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DashboardMagasinier() {
  const { data: session } = useSession();
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLowStockProducts = async () => {
    try {
      const res = await fetch("/api/magasinier/low-stock");
      const data = await res.json();
      setLowStockProducts(data.products);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits en sous-stock", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-green-800">Tableau de bord - Magasinier</h1>
        <p className="mt-2 text-lg text-gray-700">
          Surveillez les alertes de stock et intervenez rapidement pour assurer la disponibilité des produits.
        </p>
      </header>
      <section>
        <h2 className="text-2xl font-bold mb-4">Alertes de stock des produits</h2>
        {loading ? (
          <p className="text-gray-600">Chargement...</p>
        ) : lowStockProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-red-100">
                  <th className="px-6 py-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 border-b text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lowStockProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.quantite_stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">Tous les produits sont en quantité suffisante. Aucun besoin de réaprovisionnement nécessaire.</p>
        )}
      </section>
    </div>
  );
}
