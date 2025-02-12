"use client";

import { useSession } from "next-auth/react";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface CartItem {
  id: number;
  nom: string;
  quantite: number;
  quantite_stock?: number;
  prix: number;
}

export interface Produits {
  id: number;
  nom: string;
  description?: string;
  prix: number;
  quantite_stock: number;
}

export interface LignesCommandes {
  id: number;
  order_id: number;
  product_id: number;
  quantite: number;
  prix_unitaire: number;
  flagged: boolean;
  Produits?: Produits;
  Commandes?: Commandes;
}

export interface Commandes {
  id: number;
  user_id: number;
  total: number;
  statut: string;
  LignesCommandes?: LignesCommandes[];
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  updateCart: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  loadCart: () => void;
  addIngredientsToCart: (ingredients: string[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { status } = useSession();

  const isAuthenticated = useCallback(() => {
    if (status !== "authenticated") {
      console.warn("Utilisateur non authentifié, action ignorée.");
      return false;
    }
    return true;
  }, [status]);

  const syncCartToServer = async (items: CartItem[]) => {
    if (!isAuthenticated()) return;

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cartItems: items }),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        console.error("Erreur de synchronisation du panier :", errorMessage);
        toast.error("Erreur lors de la mise à jour du panier.");
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation du panier :", error);
      toast.error("Une erreur réseau est survenue.");
    }
  };

  const loadCart = useCallback(async () => {
    if (!isAuthenticated()) return;

    try {
      const res = await fetch("/api/cart", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(
          data.panier?.LignesCommandes?.map((ligne: any) => ({
            id: ligne.product_id,
            nom: ligne.Produits?.nom || "",
            prix: ligne.prix_unitaire,
            quantite: ligne.quantite,
            quantite_stock: ligne.Produits?.quantite_stock,
          })) || []
        );
      } else {
        console.error("Erreur lors du chargement du panier :", await res.text());
        toast.error("Impossible de charger le panier.");
      }
    } catch (error) {
      console.error("Erreur lors du chargement du panier :", error);
      toast.error("Une erreur réseau est survenue.");
    }
  }, [isAuthenticated]);

  const addToCart = (product: CartItem) => {
    if (!isAuthenticated()) {
      toast.warn("Veuillez vous connecter pour ajouter des articles au panier.");
      return;
    }

    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      const updated = exists
        ? prev.map((item) =>
            item.id === product.id ? { ...item, quantite: item.quantite + 1 } : item
          )
        : [...prev, { ...product, quantite: 1 }];

      syncCartToServer(updated);
      return updated;
    });

    toast.success(`${product.nom} ajouté au panier !`);
  };

  const addIngredientsToCart = (ingredients: string[]) => {
    if (!isAuthenticated()) {
      toast.warn("Veuillez vous connecter pour ajouter des ingrédients.");
      return;
    }

    setCartItems((prev) => {
      const newItems = ingredients.map((name, index) => ({
        id: prev.length + index + 1,
        nom: name,
        quantite: 1,
        prix: 0,
      }));
      const updated = [...prev, ...newItems];
      syncCartToServer(updated);
      return updated;
    });

    toast.success("Ingrédients ajoutés au panier !");
  };

  const updateCart = (id: number, delta: number) => {
    if (!isAuthenticated()) {
      toast.warn("Veuillez vous connecter pour modifier votre panier.");
      return;
    }

    setCartItems((prev) => {
      const updated = prev
        .map((item) => (item.id === id ? { ...item, quantite: item.quantite + delta } : item))
        .filter((item) => item.quantite > 0);

      syncCartToServer(updated);
      return updated;
    });
  };

  const removeFromCart = (id: number) => {
    if (!isAuthenticated()) {
      toast.warn("Veuillez vous connecter pour modifier votre panier.");
      return;
    }

    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      syncCartToServer(updated);
      return updated;
    });

    toast.info("Produit retiré du panier.");
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadCart();
    }
  }, [status, loadCart]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateCart, removeFromCart, loadCart, addIngredientsToCart }}
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
