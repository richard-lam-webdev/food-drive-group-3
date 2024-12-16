"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: any }) {
  const { cartItems, addToCart, updateCart } = useCart();
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const itemInCart = cartItems.find((item) => item.id === product.id);
    setQuantity(itemInCart ? itemInCart.quantite : 0);
  }, [cartItems, product.id]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center relative">
      <Image src="/icon/product.png" alt={product.nom || "Produit"} width={50} height={50} className="mx-auto mb-4" />
      <h3 className="text-xl font-bold text-green-600 mb-2">{product.nom || "Nom du produit"}</h3>
      <p className="text-gray-700 mb-2">{product.description || "Aucune description"}</p>
      <p className="font-bold text-gray-800 mb-4">{product.prix} €</p>

      {quantity === 0 ? (
        <button onClick={() => addToCart(product)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Ajouter au panier
        </button>
      ) : (
        <div className="flex items-center justify-center space-x-4">
          <button onClick={() => updateCart(product.id, -1)} className="bg-gray-200 px-2 py-1 rounded-lg hover:bg-gray-300">
            -
          </button>
          <span className="text-lg font-bold">{quantity}</span>
          <button onClick={() => updateCart(product.id, 1)} className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600">
            +
          </button>
        </div>
      )}
    </div>
  );
}
