"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface FloatingCartButtonProps {
  onOpen: () => void;
}

export default function FloatingCartButton({ onOpen }: FloatingCartButtonProps) {
  const { cartItems } = useCart(); 
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={onOpen} // Utilisation de la prop onOpen
          className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600"
        >
          <Image 
            src="/icon/Panier.png" 
            alt="Panier" 
            width={30} 
            height={30} 
            unoptimized 
          />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.reduce((total, item) => total + item.quantite, 0)}
            </span>
          )}
        </button>
      )}
    </>
  );
}