"use client";

import CartModal from "@/components/CartModal";
import CategoriesSection from "@/components/CategoriesSection";
import FloatingCartButton from "@/components/FloatingCartButton";
import ProductCard from "@/components/ProductCard";
import React from "react";
import { useEffect, useRef, useState } from "react";

export default function Accueil() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productsByCategory, setProductsByCategory] = useState<any>({});
  const [categories, setCategories] = useState<string[]>([]);
  const carouselRefs = useRef<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
        groupProductsByCategory(data);

        // Récupérer les catégories uniques
        const uniqueCategories = [...new Set(data.map((p: any) => p.Categories?.nom))];
        setCategories(uniqueCategories);
      } else {
        console.error("Erreur lors de la récupération des produits");
      }
    };

    fetchProducts();
  }, []);

  // 🔍 Fonction de recherche
  const handleSearch = (query: string) => {
    const filtered = products.filter((product) =>
      product.nom.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
    groupProductsByCategory(filtered);
  };

  // 🎯 Fonction de filtrage
  const handleFilter = ({ category, minPrice, maxPrice }: { category?: string; minPrice?: number; maxPrice?: number }) => {
    let filtered = [...products];

    if (category) {
      filtered = filtered.filter((product) => product.Categories?.nom === category);
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter((product) => product.prix >= minPrice);
    }

    if (maxPrice !== undefined) {
      filtered = filtered.filter((product) => product.prix <= maxPrice);
    }

    setFilteredProducts(filtered);
    groupProductsByCategory(filtered);
  };

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

      {/* 📦 Produits filtrés */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-6">Nos Produits</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Bouton flottant du panier */}
      <FloatingCartButton cartItems={cartItems} onOpen={() => setIsCartOpen(true)} />

      {/* Modale du panier */}
      {isCartOpen && <CartModal cartItems={cartItems} onClose={() => setIsCartOpen(false)} />}
    </div>
  );
}
