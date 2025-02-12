"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

type Product = {
  id: number;
  nom: string;
  description: string;
  prix: number;
  quantite_stock: number;
};

export default function ProductPage() {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  console.log("ID récupéré:", id); // Vérifie dans la console
  const router = useRouter();
  const { cartItems, addToCart, updateCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error("Produit non trouvé");
        }
        const data: Product = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Impossible de charger le produit");
        setLoading(false);
        router.push("/404");
      }
    }
    if (id) fetchProduct();
  }, [id, router]);

  useEffect(() => {
    if (product) {
      const itemInCart = cartItems.find((item) => item.id === product.id);
      setQuantity(itemInCart ? itemInCart.quantite : 0);
    }
  }, [cartItems, product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Chargement du produit...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) return null;

  const disablePlus = quantity >= product.quantite_stock;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ... le reste de ton code de rendu de la page produit ... */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
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
        <div className="flex justify-center">
          {quantity === 0 ? (
            <button
              onClick={() => addToCart({ ...product, quantite: 1 })}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Ajouter au panier
            </button>
          ) : (
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => updateCart(product.id, -1)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                -
              </button>
              <span className="text-2xl font-bold">{quantity}</span>
              <button
                onClick={() => updateCart(product.id, 1)}
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
