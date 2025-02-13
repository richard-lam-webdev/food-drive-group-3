// app/components/CategoriesSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: number;
  nom: string;
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        } else {
          console.error("Erreur lors du chargement des catégories:", await res.text());
        }
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    }
    fetchCategories();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 bg-green-50">
      <h2 className="text-3xl font-bold text-center mb-6">Nos Catégories</h2>
      {categories.length === 0 ? (
        <p className="text-center text-gray-600">Aucune catégorie trouvée.</p>
      ) : (
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
          >
            ◀
          </button>
          <div ref={carouselRef} className="flex overflow-x-auto space-x-4 scrollbar-hide px-8">
            {categories.map((cat) => (
              <div key={cat.id} className="flex-shrink-0 w-48">
                <Link
                  href={`/categorie/${encodeURIComponent(cat.nom)}`}
                  className="block bg-white p-6 rounded-lg shadow-md text-center transition hover:scale-105"
                >
                  <Image
                    src={`/categories/${cat.id}.png`}
                    alt={cat.nom}
                    width={50}
                    height={50}
                    unoptimized
                    className="mx-auto mb-4"
                  />
                  <h3 className="text-xl font-bold text-green-600">{cat.nom}</h3>
                </Link>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
          >
            ▶
          </button>
        </div>
      )}
    </section>
  );
}
