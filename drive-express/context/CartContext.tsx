"use client";

import React, { createContext, useContext, useState } from "react";

interface CartItem {
  id: string;
  nom: string;
  quantite: number;
  prix: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addIngredientsToCart: (ingredients: string[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addIngredientsToCart = (ingredients: string[]) => {
    setCartItems((prev) => {
      const updatedCart = [...prev];

      ingredients.forEach((ingredient) => {
        const existingItem = updatedCart.find((item) => item.nom === ingredient);
        if (existingItem) {
          existingItem.quantite += 1;
        } else {
          updatedCart.push({
            id: crypto.randomUUID(),
            nom: ingredient,
            quantite: 1,
            prix: 1.5,
          });
        }
      });

      return updatedCart;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addIngredientsToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
