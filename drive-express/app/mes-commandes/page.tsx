"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Order {
  id: number;
  total: number;
  statut: string;
  created_at: string;
  LignesCommandes: Array<{
    product_id: number;
    quantite: number;
    prix_unitaire: number;
    Produits: {
      nom: string;
      description?: string;
      image_url?: string;
    }
  }>;
}

export default function MesCommandesPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders);
        } else {
          console.error("Erreur lors du chargement des commandes :", await res.text());
        }
      } catch (error) {
        console.error("Erreur lors du chargement des commandes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status]);

  if (status !== "authenticated") {
    return <p>Veuillez vous connecter pour consulter vos commandes.</p>;
  }

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-8">Mes Commandes</h1>
      {orders.length === 0 ? (
        <p>Aucune commande trouvée.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="border p-4 mb-4 rounded shadow">
            <p><strong>ID :</strong> {order.id}</p>
            <p><strong>Total :</strong> {order.total} €</p>
            <p><strong>Statut :</strong> {order.statut}</p>
            <p><strong>Date :</strong> {new Date(order.created_at).toLocaleString()}</p>
            <div className="mt-2">
              <h2 className="font-bold">Articles :</h2>
              {order.LignesCommandes.map((line, index) => (
                <div key={index} className="ml-4">
                  <p>{line.Produits?.nom} - {line.quantite} x {line.prix_unitaire} €</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
