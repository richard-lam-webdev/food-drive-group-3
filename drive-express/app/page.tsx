"use client";

import CartModal from "@/components/CartModal";
import CategoriesSection from "@/components/CategoriesSection";
import FloatingCartButton from "@/components/FloatingCartButton";
import ProductCard from "@/components/ProductCard";
import React from "react";
import { useEffect, useRef, useState } from "react";

export default function Accueil() {
  const [products, setProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productsByCategory, setProductsByCategory] = useState<any>({});
  const carouselRefs = useRef<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        groupProductsByCategory(data);
      } else {
        console.error("Erreur lors de la récupération des produits");
      }
    };

    fetchProducts();
  }, []);

  const groupProductsByCategory = (products: any[]) => {
    const grouped = products.reduce((acc: any, product) => {
      const category = product.Categories?.nom || "Autres";
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {});
    setProductsByCategory(grouped);
    carouselRefs.current = Object.keys(grouped).map(() => React.createRef());
  };

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

  const updateCart = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantite: item.quantite + delta } : item
        )
        .filter((item) => item.quantite > 0)
    );
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
          <p className="text-lg text-center">Faites vos courses en toute simplicité.</p>
        </div>
      </section>

      {/* Categories Section */}
      <CategoriesSection />

      {/* Products by Category */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-6">Nos Produits</h2>
        {Object.entries(productsByCategory).map(([category, items]: any, index: number) => {
          const scroll = (direction: "left" | "right") => {
            if (carouselRefs.current[index]) {
              carouselRefs.current[index].current.scrollBy({
                left: direction === "left" ? -300 : 300,
                behavior: "smooth",
              });
            }
          };

          return (
            <div key={category} className="mb-12 px-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{category}</h3>
              <div className="relative">
                {/* Boutons de défilement */}
                <button
                  onClick={() => scroll("left")}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
                >
                  ◀
                </button>
                <div
                  ref={carouselRefs.current[index]}
                  className="flex overflow-x-auto space-x-4 scrollbar-hide"
                >
                  {items.slice(0, 5).map((product: any) => (
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
                <button
                  onClick={() => scroll("right")}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
                >
                  ▶
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bouton flottant */}
      <FloatingCartButton cartItems={cartItems} onOpen={() => setIsCartOpen(true)} />

      {/* Modale panier */}
      {isCartOpen && (
        <CartModal cartItems={cartItems} onClose={() => setIsCartOpen(false)} updateCart={updateCart} />
      )}

      {/* AI Image Analysis Section */}
      <section className="py-16 bg-yellow-50 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Analyse d'Image par l'IA</h2>
        <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
          Simplifiez votre expérience de course en utilisant notre technologie d'analyse d'image.
          Prenez une photo d'un plat ou d'une recette. Notre IA identifiera automatiquement
          les ingrédients nécessaires et les ajoutera à votre liste de courses.
        </p>
        <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-bold">
          Commencer
        </button>
      </section>
    </div>
  );
}
