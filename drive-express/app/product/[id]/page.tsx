"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

type Product = {
  id: number;
  nom: string;
  description: string;
  prix: number;
  quantite_stock: number;
  // Vous pouvez ajouter d'autres champs si nécessaire
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { cartItems, addToCart, updateCart } = useCart();

  // Le produit sera chargé depuis l'API
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  // Récupérer le produit via l'API en fonction de l'ID passé dans l'URL
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération du produit");
        }
        const data: Product = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
        // Si le produit n'est pas trouvé, rediriger vers une page 404 par exemple
        router.push("/404");
      }
    }
    fetchProduct();
  }, [params.id, router]);

  // Mettre à jour la quantité présente dans le panier pour ce produit
  useEffect(() => {
    if (product) {
      const itemInCart = cartItems.find((item) => item.id === product.id);
      setQuantity(itemInCart ? itemInCart.quantite : 0);
    }
  }, [cartItems, product]);

  // Si le produit n'est pas encore chargé, afficher un message de chargement
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Chargement du produit...</p>
      </div>
    );
  }

  const disablePlus = quantity >= product.quantite_stock;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Affichage des détails du produit */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-full flex justify-center mb-4">
            <Image
              src={`/produits/${product.id}.png`}
              alt={product.nom}
              width={200}
              height={200}
              unoptimized
              className="rounded-md"
            />
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            {product.nom}
          </h1>
          <p className="text-gray-600 text-lg mb-4">{product.description}</p>
          <p className="text-gray-800 text-xl font-bold mb-2">
            {product.prix} €
          </p>
          <p className="text-gray-500">
            Stock disponible : {product.quantite_stock}
          </p>
        </div>

        {/* Section update card pour la gestion du panier */}
        <div className="flex justify-center">
          {quantity === 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Lors de l'ajout, on ajoute la propriété "quantite" à 1 pour correspondre au type CartItem
                addToCart({ ...product, quantite: 1 });
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Ajouter au panier
            </button>
          ) : (
            <div
              className="flex items-center justify-center space-x-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateCart(product.id, -1);
                }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                -
              </button>
              <span className="text-2xl font-bold">{quantity}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateCart(product.id, 1);
                }}
                disabled={disablePlus}
                className={`px-4 py-2 rounded transition ${
                  disablePlus
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
