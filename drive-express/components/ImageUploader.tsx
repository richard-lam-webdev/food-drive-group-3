"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageUploader({ onImageUpload }: { onImageUpload: (file: File, ingredients: string[]) => void }) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setError("Veuillez sélectionner une image.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("/api/detect-ingredients", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("📥 Données reçues de l'API :", data);

      if (response.ok) {
        const cleanedIngredients = data.ingredients?.filter((ing: string) => /^\d+\./.test(ing)) || [];
        onImageUpload(selectedImage, cleanedIngredients);
      } else {
        setError(data.error || "Erreur lors de la détection des ingrédients.");
      }
    } catch (err) {
      console.error("🚨 Erreur lors de la détection des ingrédients :", err);
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-xl font-bold mb-4">📸 Détection des Ingrédients</h2>

      <label className="block border-2 border-dashed p-4 cursor-pointer hover:bg-gray-100">
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <span className="text-gray-600">📤 Importer une image</span>
      </label>

      {previewUrl && (
        <div className="mt-4">
          <h3 className="text-md font-semibold">Image sélectionnée :</h3>
          <Image src={previewUrl} alt="Preview" width={150} height={150} className="rounded-lg mx-auto" />
        </div>
      )}

      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Analyse en cours..." : "Analyser l’image"}
      </button>
      
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
