"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import CartModal from "@/components/CartModal";
import FloatingCartButton from "@/components/FloatingCartButton";

export default function Accueil() {
  const [products, setProducts] = useState<any[]>([]); // Liste des produits
  const [cartItems, setCartItems] = useState<any[]>([]); // Panier global
  const [isCartOpen, setIsCartOpen] = useState(false); // État de la modale panier
  const carouselRef = useRef<HTMLDivElement>(null); // Référence pour le carrousel

  // Récupération des produits depuis l'API
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.slice(0, 10)); // Prendre seulement les 10 premiers produits
      } else {
        console.error("Erreur lors de la récupération des produits");
      }
    };

    fetchProducts();
  }, []);

  // Ajouter un produit au panier
  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantite: item.quantite + 1 } : item
        );
      }
      return [...prev, { ...product, quantite: 1 }];
    });
  };

  // Mettre à jour la quantité dans le panier
  const updateCart = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantite: item.quantite + delta } : item
        )
        .filter((item) => item.quantite > 0)
    );
  };

  // Fonction pour défiler horizontalement
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="text-gray-800">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[300px] text-white"
        style={{ backgroundImage: "url(/image/illustration1.jpg)" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full">
          <h1 className="text-4xl font-extrabold mb-4 text-center">
            Bienvenue sur Drive Express
          </h1>
          <p className="text-lg text-center">
            Faites vos courses en toute simplicité.
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-green-50">
        <h2 className="text-3xl font-bold text-center mb-6">Nos Catégories</h2>
        <p className="text-center text-gray-600 mb-12">
          Parcourez nos sélections soigneusement choisies pour répondre à tous vos besoins en matière de courses.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 px-6">
          {/* Catégorie 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Image src="/icon/harvest.png" alt="Fruits" width={50} height={50} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-600">Fruits</h3>
          </div>
          {/* Catégorie 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Image src="/icon/vegetable.png" alt="Légumes" width={50} height={50} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-600">Légumes</h3>
          </div>
          {/* Catégorie 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Image src="/icon/milk.png" alt="Produits Laitiers" width={50} height={50} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-600">Œufs & Produits Laitiers</h3>
          </div>
          {/* Catégorie 4 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Image src="/icon/breads.png" alt="Pain et Pâtisseries" width={50} height={50} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-600">Pain & Pâtisseries</h3>
          </div>
          {/* Catégorie 5 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Image src="/icon/cheers.png" alt="Boissons" width={50} height={50} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-600">Boissons</h3>
          </div>
          {/* Catégorie 6 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Image src="/icon/fish.png" alt="Poisson & Fruits de Mer" width={50} height={50} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-600">Poisson & Fruits de Mer</h3>
          </div>
        </div>
      </section>

      {/* Products Section - Carrousel */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-6">Nos Produits</h2>
        <div className="relative px-6">
          {/* Bouton de défilement gauche */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
          >
            ◀
          </button>

          {/* Carrousel */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth"
          >
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-64">
                <ProductCard
                  product={product}
                  cartItems={cartItems}
                  addToCart={addToCart}
                  updateCart={updateCart}
                />
              </div>
            ))}
          </div>

          {/* Bouton de défilement droit */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
          >
            ▶
          </button>
        </div>
      </section>

      {/* Bouton flottant */}
      <FloatingCartButton cartItems={cartItems} onOpen={() => setIsCartOpen(true)} />

      {/* Modale panier */}
      {isCartOpen && (
        <CartModal
          cartItems={cartItems}
          onClose={() => setIsCartOpen(false)}
          updateCart={updateCart}
        />
      )}

      {/* AI Image Analysis Section */}
      <section className="py-16 bg-yellow-50 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Analyse d'Image par l'IA
        </h2>
        <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
          Simplifiez votre expérience de course en utilisant notre technologie
          d'analyse d'image. Prenez une photo d'un plat ou d'une recette. Notre
          IA identifiera automatiquement les ingrédients nécessaires et les
          ajoutera à votre liste de courses.
        </p>
        <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-bold">
          Commencer
        </button>
      </section>
    </div>
  );
}
