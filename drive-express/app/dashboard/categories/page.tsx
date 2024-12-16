'use client';

import { useEffect, useState } from 'react';

export default function Categories() {
  // États pour les catégories
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');

  // Fetch catégories
  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Ajouter catégorie
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ nom: categoryName }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setCategoryName('');
      fetchCategories();
    } else {
      alert('Erreur lors de la création de la catégorie');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Gestion des Catégories</h1>

      {/* Formulaire pour ajouter une catégorie */}
      <form onSubmit={handleCategorySubmit} className="flex space-x-4 mb-8">
        <input
          type="text"
          placeholder="Nom de la catégorie"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="px-4 py-2 border rounded w-full"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Ajouter
        </button>
      </form>

      {/* Liste des catégories */}
      <ul className="space-y-2">
        {categories.map((category: any) => (
          <li key={category.id} className="p-2 border rounded">
            {category.nom}
          </li>
        ))}
      </ul>
    </div>
  );
}
