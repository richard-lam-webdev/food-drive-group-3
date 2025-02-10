"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface CartItem {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
  quantite_stock?: number; // Pour vérifier le stock
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  updateCart: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  loadCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { data: session, status } = useSession();

  // Fonction pour synchroniser le panier vers le serveur via l'API /api/cart (POST)
  const syncCartToServer = async (items: CartItem[]) => {
    // N'appelle l'API que si l'utilisateur est authentifié
    if (status !== "authenticated") {
      console.error("Utilisateur non authentifié, synchronisation du panier ignorée.");
      return;
    }
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cartItems: items }),
      });
      if (!res.ok) {
        console.error("Erreur de synchronisation du panier :", await res.text());
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation du panier :", error);
    }
  };

  // Charger le panier depuis le serveur via l'API /api/cart (GET)
const loadCart = async () => {
  if (status !== "authenticated") return;
  try {
    const res = await fetch("/api/cart", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.panier && data.panier.LignesCommandes) {
        // Reconstituer le panier à partir des lignes de commande en incluant les infos produit
        const items: CartItem[] = data.panier.LignesCommandes.map((ligne: any) => ({
          id: ligne.product_id,
          nom: ligne.Produits?.nom || "",
          prix: ligne.prix_unitaire,
          quantite: ligne.quantite,
          quantite_stock: ligne.Produits?.quantite_stock,
        }));
        setCartItems(items);
      }
    } else {
      console.error("Erreur lors du chargement du panier :", await res.text());
    }
  } catch (error) {
    console.error("Erreur lors du chargement du panier :", error);
  }
};

  const addToCart = (product: CartItem) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      let updated: CartItem[];
      if (exists) {
        updated = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        );
      } else {
        updated = [...prev, { ...product, quantite: 1 }];
      }
      syncCartToServer(updated);
      return updated;
    });
  };

  const updateCart = (id: number, delta: number) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) =>
          item.id === id ? { ...item, quantite: item.quantite + delta } : item
        )
        .filter((item) => item.quantite > 0);
      syncCartToServer(updated);
      return updated;
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      syncCartToServer(updated);
      return updated;
    });
  };

  // Charger le panier au montage si l'utilisateur est authentifié
  useEffect(() => {
    if (status === "authenticated") {
      loadCart();
    }
  }, [status]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateCart, removeFromCart, loadCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
