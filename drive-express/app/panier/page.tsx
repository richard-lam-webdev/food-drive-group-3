"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

  // Afficher le popup de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!session) {
      setIsPopupOpen(true);
    }
  }, [session]);

  const handleNextStep = () => {
    if (!session) {
      setIsPopupOpen(true);
      return;
    }
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
          cartItems.map((item) => {
            // Vérifier si on peut augmenter la quantité (en fonction du stock)
            const disablePlus = item.quantite >= (item.quantite_stock ?? 0);
            return (
              <div key={item.id} className="border-b py-4">
                <div className="flex justify-between items-center">
                  {/* Utilisation de l'ID du produit pour générer le chemin de l'image */}
                  <Image
                    src={`/produits/${item.id}.png`}
                    alt={item.nom}
                    width={64}
                    height={64}
                    className="object-cover rounded"
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
                  <button
                    onClick={() => updateCart(item.id, -1)}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold">{item.quantite}</span>
                  <button
                    onClick={() => updateCart(item.id, 1)}
                    disabled={disablePlus}
                    className={`px-2 py-1 rounded ${
                      disablePlus
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    +
                  </button>
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
            );
          })
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
              Veuillez vous connecter ou vous inscrire pour finaliser votre commande.
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
                S&apos;inscrire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
