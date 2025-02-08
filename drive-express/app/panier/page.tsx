"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";

export default function PanierPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cartItems, updateCart, removeFromCart } = useCart();
  const [subTotal, setSubTotal] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Calcul du sous-total
  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.prix * item.quantite,
      0
    );
    setSubTotal(total);
  }, [cartItems]);

  // Vérifie si l'utilisateur est connecté, sinon popup
  useEffect(() => {
    if (!session) {
      setIsPopupOpen(true);
    }
  }, [session]);

  const handleNextStep = () => {
    if (!session) {
      // Forcer l'ouverture du popup si on n'est pas connecté
      setIsPopupOpen(true);
      return;
    }
    // Si connecté, on passe à l'étape /panier/livraison
    router.push("/panier/livraison");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
        Votre Panier
      </h1>

      {/* Liste des produits */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src="/icon/product.png"
                  alt={item.nom}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-bold">{item.nom}</p>
                  <p className="text-gray-500">
                    Prix unitaire : {item.prix.toFixed(2)} € | Quantité :{" "}
                    {item.quantite}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Boutons de modification */}
                <button
                  onClick={() => updateCart(item.id, -1)}
                  className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span className="text-lg font-bold">{item.quantite}</span>
                <button
                  onClick={() => updateCart(item.id, +1)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  +
                </button>

                {/* Bouton de suppression */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  🗑️
                </button>
              </div>

              <p className="font-bold">
                {(item.prix * item.quantite).toFixed(2)} €
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Votre panier est vide.</p>
        )}
      </div>

      {/* Récapitulatif et bouton de suite */}
      {cartItems.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="font-bold text-lg mb-4">Sous-total</h2>
          <p className="text-xl font-semibold mb-4">{subTotal.toFixed(2)} €</p>
          <button
            onClick={handleNextStep}
            className="bg-green-600 text-white w-full p-4 rounded-lg hover:bg-green-700"
          >
            Continuer
          </button>
        </div>
      )}

      {/* Pop-up de Connexion (si pas de session) */}
      {isPopupOpen && !session && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center relative">
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">Connectez-vous</h2>
            <p className="mb-4">
              Veuillez vous connecter ou vous inscrire pour finaliser votre
              commande.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push("/login")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Se connecter
              </button>
              <button
                onClick={() => router.push("/register")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
