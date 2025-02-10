"use client";

import { useEffect, useState } from "react";
import Image from "next/image";


interface Category {
  id: number;
  nom: string;
  // Vous pouvez ajouter d'autres champs si nécessaire
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ nom: categoryName }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      if (imageFile && data.id) {
        const formData = new FormData();
        formData.append("categoryId", data.id);
        formData.append("image", imageFile);
        await fetch("/api/categories/upload-image", {
          method: "POST",
          body: formData,
        });
        setImageFile(null);
      }
      setCategoryName('');
      fetchCategories();
    } else {
      alert('Erreur lors de la création de la catégorie');
    }
  };

  const handleImageUpdate = async (categoryId: number, file: File) => {
    const formData = new FormData();
    formData.append("categoryId", categoryId.toString());
    formData.append("image", file);
    const res = await fetch("/api/categories/upload-image", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      fetchCategories();
      setEditingCategoryId(null);
    } else {
      alert("Erreur lors de la mise à jour de l'image");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Gestion des Catégories</h1>

      <form onSubmit={handleCategorySubmit} className="flex space-x-4 mb-8">
        <input
          type="text"
          placeholder="Nom de la catégorie"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="px-4 py-2 border rounded w-full"
          required
        />
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImageFile(e.target.files[0]);
            }
          }}
          className="px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Ajouter
        </button>
      </form>

      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id} className="p-2 border rounded flex items-center space-x-4">
            <Image
              src={`/categories/${category.id}.png`}
              alt={category.nom}
              width={100}
              height={100}
              unoptimized
              className="w-12 h-12 object-cover rounded"
            />
            <span className="flex-1">{category.nom}</span>
            {editingCategoryId === category.id ? (
              <>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageUpdate(category.id, e.target.files[0]);
                    }
                  }}
                  className="px-2 py-1 border rounded"
                />
                <button
                  onClick={() => setEditingCategoryId(null)}
                  className="px-2 py-1 bg-gray-500 text-white rounded"
                >
                  Annuler
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditingCategoryId(category.id)}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Modifier l&apos;image
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
