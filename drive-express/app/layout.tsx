"use client";

import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import ClientWrapper from "../components/ClientWrapper";
import Header from "../components/Header";
import "./globals.css";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100">
        <ClientWrapper>
          <CartProvider>
            <ProductsProvider>
              <Header />
              <main>{children}</main>
            </ProductsProvider>
          </CartProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
