"use client";

import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import CartModal from "./CartModal";
import SearchBar from "./SearchBar";

export default function Header() {
  const { data: session } = useSession();
  const { cartItems } = useCart();
  const { products } = useProducts();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = useCallback(
    (query: string) => {
      if (!query) {
        setFilteredProducts([]);
        setShowResults(false);
        return;
      }
      if (products.length > 0) {
        const results = products.filter((product) =>
          product.nom.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(results);
        setShowResults(true);
      }
    },
    [products]
  );

  return (
    <header className="bg-white shadow-md py-4 px-6 flex flex-col md:flex-row md:justify-between items-center gap-4 relative">
      {/* Logo / Titre */}
      <Link href="/" className="text-2xl font-bold text-blue-600">
        Drive Express
      </Link>

      {/* Barre de recherche */}
      <div className="w-full md:w-1/3 relative">
        <SearchBar onSearch={handleSearch} />
        {showResults && filteredProducts.length > 0 && (
          <div className="absolute top-12 left-0 w-full bg-white shadow-md rounded-lg p-2 z-50">
            <button
              onClick={() => setShowResults(false)}
              className="text-right text-red-500 text-sm font-bold block w-full"
            >
              ✖ Fermer
            </button>
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="block p-2 hover:bg-gray-100"
              >
                {product.nom}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Menu utilisateur */}
      <div className="flex space-x-4 items-center">
        {!session ? (
          <>
            <Link
              href="/register"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              M'inscrire
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Me connecter
            </Link>
          </>
        ) : (
          <>
            {session.user.role === "admin" && (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/profile"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Voir mon profil
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Se déconnecter
            </button>
          </>
        )}
      </div>

      {/* Boutons d'icône pour "Mes Commandes" et "Panier" */}
      <div className="flex space-x-4 items-center">
        {session && (
          <Link href="/mes-commandes" className="relative">
            <Image
              src="/icon/Orders.png"
              alt="Mes Commandes"
              width={30}
              height={30}
              unoptimized
            />
          </Link>
        )}
        <button onClick={() => setIsCartOpen(true)} className="relative">
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
      </div>

      {/* Modale du panier */}
      {isCartOpen && (
        <CartModal
          cartItems={cartItems}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </header>
  );
}
