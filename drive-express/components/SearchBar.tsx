"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // ✅ Icône de recherche

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // ✅ Déclenche la recherche en temps réel
  };

  const handleSearch = () => {
    onSearch(query); // ✅ Toujours utile pour la loupe ou Entrée
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={query}
        onChange={handleChange} // ✅ Recherche instantanée
        className="w-full p-2 border rounded-lg pl-10"
      />
      <button
        onClick={handleSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
      >
        <FaSearch size={18} />
      </button>
    </div>
  );
}
