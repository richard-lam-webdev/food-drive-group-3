"use client";

import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';


interface Order {
  id: number;
  total: number;
  statut: string;
  created_at: string;
  Utilisateurs: { email: string };
}

export default function ValidateOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();


  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        console.error("Erreur lors du chargement des commandes:", await res.text());
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (status === 'loading') {
    return <p>Chargement...</p>;
  }

  if (!session || session.user.role !== 'admin') {
    return <p>Accès refusé. Veuillez vous connecter en tant qu’administrateur.</p>;
  }

  const handleValidate = async (orderId: number) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/validate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        alert("Commande validée pour envoi !");
        fetchOrders();
      } else {
        const errorText = await res.text();
        alert("Erreur : " + errorText);
      }
    } catch (error) {
      console.error("Erreur lors de la validation de la commande:", error);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (orders.length === 0) return <p>Aucune commande trouvée.</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Validation des Commandes</h1>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 p-2">ID</th>
            <th className="border border-gray-200 p-2">Client</th>
            <th className="border border-gray-200 p-2">Total</th>
            <th className="border border-gray-200 p-2">Statut</th>
            <th className="border border-gray-200 p-2">Date</th>
            <th className="border border-gray-200 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border border-gray-200 p-2">{order.id}</td>
              <td className="border border-gray-200 p-2">{order.Utilisateurs.email}</td>
              <td className="border border-gray-200 p-2">{order.total} €</td>
              <td className="border border-gray-200 p-2">{order.statut}</td>
              <td className="border border-gray-200 p-2">{new Date(order.created_at).toLocaleString()}</td>
              <td className="border border-gray-200 p-2">
                {order.statut === "payee" ? (
                  <button
                    onClick={() => handleValidate(order.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Valider l&apos;envoi
                  </button>
                ) : (
                  <span>Expédiée</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
