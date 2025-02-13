"use client";

import { useState, useEffect } from "react";

type FiltersProps = {
  products: any[];
  setFilteredProducts: (products: any[]) => void;
};

export default function Filters({ products, setFilteredProducts }: FiltersProps) {
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [categories, setCategories] = useState<string[]>([]);

  // Récupération des catégories depuis l'API
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/categories");
      if (!res.ok) return;
      const data = await res.json();
      // On suppose que data est un tableau d'objets { nom: string }
      setCategories(data.map((cat: { nom: string }) => cat.nom));
    }
    fetchCategories();
  }, []);

  // Fonction pour appliquer les filtres
  const applyFilters = () => {
    const filtered = products.filter((product) => {
      // Filtrer par catégorie si renseignée
      const matchCategory = category ? product.Categories?.nom === category : true;

      // Filtrer par prix
      let matchMinPrice = true;
      let matchMaxPrice = true;
      if (minPrice !== "") {
        matchMinPrice = product.prix >= Number(minPrice);
      }
      if (maxPrice !== "") {
        matchMaxPrice = product.prix <= Number(maxPrice);
      }
      return matchCategory && matchMinPrice && matchMaxPrice;
    });
    setFilteredProducts(filtered);
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4">
      {/* Filtre de prix : min et max */}
      <div className="flex flex-col md:flex-row gap-2 items-center">
        <input
          type="number"
          placeholder="Prix min"
          value={minPrice}
          onChange={(e) =>
            setMinPrice(e.target.value ? Number(e.target.value) : "")
          }
          className="w-full md:w-auto p-2 border rounded-md shadow-sm"
        />
        <input
          type="number"
          placeholder="Prix max"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(e.target.value ? Number(e.target.value) : "")
          }
          className="w-full md:w-auto p-2 border rounded-md shadow-sm"
        />
      </div>

      {/* Sélecteur de catégorie */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full md:w-1/4 p-2 border rounded-md shadow-sm"
      >
        <option value="">Toutes les catégories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Bouton "Appliquer" */}
      <button
        onClick={applyFilters}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
      >
        Appliquer
      </button>
    </div>
  );
}
