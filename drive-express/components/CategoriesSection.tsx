"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  { src: "/icon/harvest.png", title: "Fruits" },
  { src: "/icon/vegetable.png", title: "Légumes" },
  { src: "/icon/milk.png", title: "Œufs & Produits Laitiers" },
  { src: "/icon/breads.png", title: "Pain & Pâtisseries" },
  { src: "/icon/cheers.png", title: "Boissons" },
  { src: "/icon/fish.png", title: "Poisson & Fruits de Mer" },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-green-50">
      <h2 className="text-3xl font-bold text-center mb-6">Nos Catégories</h2>
      <p className="text-center text-gray-600 mb-12">
        Parcourez nos sélections soigneusement choisies pour répondre à tous vos besoins en matière de courses.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 px-6">
        {categories.map((cat) => (
          <div key={cat.title} className="cursor-pointer">
            <Link href={`/categorie/${encodeURIComponent(cat.title)}`} legacyBehavior>
              <a className="block bg-white p-6 rounded-lg shadow-md text-center transition hover:scale-105">
                <Image src={cat.src} alt={cat.title} width={50} height={50} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-600">{cat.title}</h3>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
