import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";

type Product = {
  id: number;
  nom: string;
  description: string;
  prix: number;
  quantite_stock: number;
};

async function getProductsByCategory(category: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(
      `${apiUrl}/api/products?category=${encodeURIComponent(category)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error(`Erreur API: ${res.status}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryName = decodeURIComponent(category);
  const products: Product[] | null = await getProductsByCategory(categoryName);

  if (!products) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{categoryName}</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ⬅ Retour
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            Aucun produit trouvé.
          </p>
        )}
      </div>
    </div>
  );
}
