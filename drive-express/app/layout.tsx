"use client";

import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext"; // ✅ Import du provider
import ClientWrapper from "../components/ClientWrapper";
import Header from "../components/Header";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100">
        <ClientWrapper>
          <CartProvider>
            <ProductsProvider> {/* ✅ Permet d'accéder aux produits partout */}
              <Header />
              <main>{children}</main>
            </ProductsProvider>
          </CartProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
