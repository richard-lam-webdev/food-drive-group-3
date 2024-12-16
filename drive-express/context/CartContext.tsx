"use client";

import React, { createContext, useContext, useState } from "react";

interface CartItem {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  updateCart: (id: number, delta: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Ajouter un produit au panier
  const addToCart = (product: CartItem) => {
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

  // Mettre à jour la quantité d'un produit
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
    <CartContext.Provider value={{ cartItems, addToCart, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
