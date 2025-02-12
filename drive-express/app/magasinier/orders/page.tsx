"use client";

import MagasinierProtectedPage from "@/components/MagasinierProtectedPage";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Order {
  id: number;
  total: number;
  statut: string;
  created_at: string;
  Utilisateurs: { email: string };
  LignesCommandes: Array<{
    id: number;
    quantite: number;
    flagged: boolean;
    Produits: { nom: string };
    prix_unitaire: number;
  }>;
}

export default function OrdersPreparation() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/magasinier/orders", { method: "GET" });
      const data = await res.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const pendingOrders = orders.filter(
    (order) => order.statut === "payee" || order.statut === "pretelivrable"
  );
  const completedOrders = orders.filter(
    (order) => order.statut === "traite"
  );

  // Fonction pour flaguer une ligne de commande
  const flagLine = async (orderId: number, lineId: number) => {
    try {
      const res = await fetch(`/api/magasinier/orders/${orderId}/lines/${lineId}`, {
        method: "PATCH",
      });
      if (res.ok) {
        fetchOrders();
      } else {
        console.error("Erreur lors du flagging de la ligne");
      }
    } catch (error) {
      console.error("Erreur lors du flagging de la ligne", error);
    }
  };

  return (
    <MagasinierProtectedPage>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Préparation des Commandes</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <>
            {pendingOrders.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Commandes à préparer</h2>
                {pendingOrders.map((order) => (
                  <div key={order.id} className="border p-4 my-4 rounded shadow">
                    <p><strong>ID :</strong> {order.id}</p>
                    <p><strong>Total :</strong> {order.total} €</p>
                    <p><strong>Statut :</strong> {order.statut}</p>
                    <p><strong>Date :</strong> {new Date(order.created_at).toLocaleString()}</p>
                    <div className="mt-2">
                      <h3 className="font-bold">Articles :</h3>
                      {order.LignesCommandes.map((line) => (
                        <div key={line.id} className="ml-4 flex items-center justify-between py-2">
                          <span>
                            {line.Produits?.nom} - {line.quantite} x {line.prix_unitaire} €
                          </span>
                          {!line.flagged && (
                            <button
                              onClick={() => flagLine(order.id, line.id)}
                              className="bg-green-500 text-white px-2 py-1 rounded"
                            >
                              Flaguer cette ligne
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Aucune commande à préparer.</p>
            )}

            {completedOrders.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Commandes traitées</h2>
                {completedOrders.map((order) => (
                  <div key={order.id} className="border p-4 my-4 rounded shadow">
                    <p><strong>ID :</strong> {order.id}</p>
                    <p><strong>Total :</strong> {order.total} €</p>
                    <p><strong>Statut :</strong> {order.statut}</p>
                    <p><strong>Date :</strong> {new Date(order.created_at).toLocaleString()}</p>
                    <div className="mt-2">
                      <h3 className="font-bold">Articles :</h3>
                      {order.LignesCommandes.map((line) => (
                        <div key={line.id} className="ml-4 flex items-center justify-between py-2">
                          <span>
                            {line.Produits?.nom} - {line.quantite} x {line.prix_unitaire} €
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MagasinierProtectedPage>
  );
}
