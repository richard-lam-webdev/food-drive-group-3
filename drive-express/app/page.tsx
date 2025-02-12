"use client";

import CartModal from "@/components/CartModal";
import CategoriesSection from "@/components/CategoriesSection";
import FloatingCartButton from "@/components/FloatingCartButton";
import ProductCard from "@/components/ProductCard";
import React from "react";
import { useEffect, useRef, useState } from "react";

interface Category {
  id: number;
  nom: string;
}

interface Product {
  id: number;
  nom: string;
  prix: number;
  description: string;
  quantite_stock: number;
  Categories?: Category;
}

export default function Accueil() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const carouselRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data: Product[] = await res.json();
        setFilteredProducts(data);
        groupProductsByCategory(data);
      } else {
        console.error("Erreur lors de la récupération des produits");
      }
    };

    fetchProducts();
  }, []);



  // 🎯 Fonction de filtrage à faire 
/*
  const handleFilter = (filters: { 
    category?: string; 
    minPrice?: number; 
    maxPrice?: number 
  }) => {
    let filtered = [...products];
    
    if (filters.category) {
      filtered = filtered.filter(
        product => product.Categories?.nom === filters.category
      );
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.prix >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.prix <= filters.maxPrice!);
    }

    setFilteredProducts(filtered);
    groupProductsByCategory(filtered);
  };
  */

  const groupProductsByCategory = (products: Product[]) => {
    const grouped = products.reduce((acc: Record<string, Product[]>, product) => {
      const categoryName = product.Categories?.nom || "Autres";
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(product);
      return acc;
    }, {});
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
          {filteredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Bouton flottant du panier */}
      <FloatingCartButton onOpen={() => setIsCartOpen(true)} />

      {/* Modale du panier */}
      {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}    </div>
  );
}
