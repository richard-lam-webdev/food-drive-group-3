"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



interface Product {
  id: number;
  nom: string;
  prix: number;
  description: string;
  quantite_stock: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { cartItems, addToCart, updateCart } = useCart();
  const [quantity, setQuantity] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const itemInCart = cartItems.find((item) => item.id === product.id);
    setQuantity(itemInCart ? itemInCart.quantite : 0);
  }, [cartItems, product.id]);

  const disablePlus = quantity >= product.quantite_stock;

  // Gère la navigation vers la page produit lors du clic sur la carte
  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg text-center relative transform transition duration-300 hover:scale-105 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Affichage de l'image */}
      <div className="w-full flex justify-center mb-4">
        <Image
          src={`/produits/${product.id}.png`}
          alt={product.nom || "Produit"}
          width={100}
          height={100}
          unoptimized
          className="rounded-md"
        />
      </div>
      <h3 className="text-2xl font-bold text-green-700 mb-2">
        {product.nom || "Nom du produit"}
      </h3>
      <p className="text-gray-600 mb-2">
        {product.description || "Aucune description"}
      </p>
      <p className="font-bold text-gray-800 mb-4 text-lg">{product.prix} €</p>

      {quantity === 0 ? (
        <button
          onClick={(e) => {
            stopPropagation(e);
            addToCart({ ...product, quantite: 1 });
          }}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Ajouter au panier
        </button>
      ) : (
        <div className="flex items-center justify-center space-x-4" onClick={stopPropagation}>
          <button
            onClick={(e) => {
              stopPropagation(e);
              updateCart(product.id, -1);
            }}
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition"
          >
            -
          </button>
          <span className="text-xl font-bold">{quantity}</span>
          <button
            onClick={(e) => {
              stopPropagation(e);
              updateCart(product.id, 1);
            }}
            disabled={disablePlus}
            className={`px-3 py-1 rounded transition ${
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
  );
}
