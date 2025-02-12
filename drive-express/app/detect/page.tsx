"use client";

import ImageUploader from "@/components/ImageUploader";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

interface DetectResponse {
  foundIngredients: string[];
  missingIngredients: string[];
}


export default function DetectionPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [missingIngredients, setMissingIngredients] = useState<string[]>([]);
  const { addIngredientsToCart } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    const savedIngredients = localStorage.getItem("ingredients");
    if (savedIngredients) {
      setIngredients(JSON.parse(savedIngredients));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ingredients", JSON.stringify(ingredients));
  }, [ingredients]);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
  
    const res = await fetch("/api/detect-ingredients", {
      method: "POST",
      body: formData,
    });
  
    const data = (await res.json()) as DetectResponse;
    console.log("📥 Données reçues de l'API :", data);
  
    setIngredients([...new Set(data.foundIngredients)]);
    setMissingIngredients([...new Set(data.missingIngredients)]);
  };
  

  const handleAddToCart = () => {
    addIngredientsToCart(ingredients);
    setMessage("✅ Ingrédients ajoutés à votre liste de courses !");
    setTimeout(() => setMessage(null), 3000);
  };

  const handleReportMissingIngredients = async () => {
    if (reported || missingIngredients.length === 0) return;
    
    const res = await fetch("/api/report-missing-ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ missingIngredients }),
    });

    if (res.ok) {
      setReported(true);
      setMessage("📩 Ingrédients signalés à l'administration.");
    } else {
      setMessage("❌ Erreur lors du signalement.");
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">📷 Détection d’Ingrédients</h1>
      <ImageUploader onImageUpload={handleUpload} />

      {ingredients.length > 0 && (
        <div className="mt-6 p-4 border rounded-md shadow-md bg-white max-w-md">
          <h2 className="text-xl font-semibold">🍽️ Ingrédients détectés :</h2>
          <ul className="list-disc pl-5 text-gray-700">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          <button
            onClick={handleAddToCart}
            className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
          >
            ➕ Ajouter à ma liste de courses
          </button>

          {message && <p className="mt-2 text-green-600">{message}</p>}
        </div>
      )}

      {missingIngredients.length > 0 && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          ⚠️ Certains ingrédients ne sont pas en base :
          <ul>
            {missingIngredients.map((ing, index) => (
              <li key={index}>- {ing}</li>
            ))}
          </ul>
          <button onClick={handleReportMissingIngredients} className="mt-2 bg-red-500 text-white px-4 py-2 rounded">
            🚨 Signaler
          </button>
        </div>
      )}
    </div>
  );
}
