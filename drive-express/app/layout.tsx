import Link from "next/link";
import AccountMenu from "../components/AccountMenu";
import ClientWrapper from "../components/ClientWrapper";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";


export const metadata = {
  title: "Drive Alimentaire",
  description: "Simplifiez vos courses avec notre Drive Alimentaire",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100">
        <ClientWrapper>
          <CartProvider>
            <header className="bg-white shadow p-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-blue-600">
                <Link href="/">Drive Express</Link>
              </h1>
              <AccountMenu />
            </header>
            <main>{children}</main>
          </CartProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
