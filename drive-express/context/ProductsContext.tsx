"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface Product {
  id: number;
  nom: string;
  description: string;
  prix: number;
  quantite_stock: number;
  categorie_id: number;
}

interface ProductsContextType {
  products: Product[];
}

const ProductsContext = createContext<ProductsContextType>({ products: [] });

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          console.error("Erreur lors de la récupération des produits");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
