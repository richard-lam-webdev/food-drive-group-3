"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CartModal({ onClose }: { onClose: () => void }) {
  const { cartItems, updateCart } = useCart();
  const router = useRouter();

  const handleViewCart = () => {
    onClose(); // Fermer la modale avant la redirection
    router.push("/panier");
  };

  // Calculer le total pour chaque produit et le total général
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.prix * item.quantite,
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Votre Panier</h2>

        {cartItems.length > 0 ? (
          <>
            {/* Liste des produits */}
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800">{item.nom}</p>
                    <p className="text-gray-600 text-sm">
                      {item.prix} € x {item.quantite} ={" "}
                      <span className="font-semibold">
                        {(item.prix * item.quantite).toFixed(2)} €
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateCart(item.id, -1)}
                      className="bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold">{item.quantite}</span>
                    <button
                      onClick={() => updateCart(item.id, 1)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Sous-total */}
            <div className="mt-6 border-t pt-4">
              <p className="text-right text-lg font-bold text-gray-800">
                Sous-total :{" "}
                <span className="text-green-600">
                  {totalAmount.toFixed(2)} €
                </span>
              </p>
            </div>

            {/* Bouton Voir le panier */}
            <button
              onClick={handleViewCart}
              className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 w-full font-bold"
            >
              Voir mon panier
            </button>
          </>
        ) : (
          <p className="text-center text-gray-600">Votre panier est vide.</p>
        )}

        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="mt-4 bg-gray-300 p-2 rounded-lg hover:bg-gray-400 w-full"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
