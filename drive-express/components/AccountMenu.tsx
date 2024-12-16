"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import CartModal from "./CartModal";

export default function AccountMenu() {
  const { data: session } = useSession();
  const { cartItems, updateCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex space-x-4 items-center">
      {!session ? (
        <>
          <Link href="/register" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            M'inscrire
          </Link>
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Me connecter
          </Link>
        </>
      ) : (
        <>
          <Link href="/dashboard" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Dashboard
          </Link>
          <Link href="/profile" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Voir mon profil
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} 
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Se déconnecter
          </button>
        </>
      )}

      <button onClick={() => setIsCartOpen(true)} className="relative">
        <Image src="/icon/Panier.png" alt="Panier" width={30} height={30} />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems.reduce((total, item) => total + item.quantite, 0)}
          </span>
        )}
      </button>

      {isCartOpen && <CartModal cartItems={cartItems} onClose={() => setIsCartOpen(false)} updateCart={updateCart} />}
    </div>
  );
}
