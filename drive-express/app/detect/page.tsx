"use client";

import ImageUploader from "@/components/ImageUploader";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DetectResponse {
  foundIngredients: string[];
  missingIngredients: string[];
}

export default function DetectionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Redirection si l'utilisateur n'est pas authentifié en tant que client
  useEffect(() => {
    if (status === "loading") return; 
    if (!session || session.user.role !== "client") {
      router.push("/login");
    }
  }, [session, status, router]);

  // États pour les ingrédients détectés et manquants
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [missingIngredients, setMissingIngredients] = useState<string[]>([]);
  const { addIngredientsToCart } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const [reported, setReported] = useState(false);

  // Charger les ingrédients depuis localStorage lors du montage
  useEffect(() => {
    const savedIngredients = localStorage.getItem("ingredients");
    if (savedIngredients) {
      setIngredients(JSON.parse(savedIngredients));
    }
  }, []);

  // Mettre à jour localStorage chaque fois que le state 'ingredients' change
  useEffect(() => {
    localStorage.setItem("ingredients", JSON.stringify(ingredients));
  }, [ingredients]);

  // Fonction d'upload et de traitement de l'image
  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/detect-ingredients", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        setMessage("❌ Erreur lors de la détection des ingrédients.");
        return;
      }

      // Traitement de la réponse JSON
      const data = (await res.json()) as DetectResponse;
      setIngredients([...new Set(data.foundIngredients)]);
      setMissingIngredients([...new Set(data.missingIngredients)]);
    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
      setMessage("❌ Erreur lors de l'upload de l'image.");
    }
  };

  // Ajouter les ingrédients détectés au panier
  const handleAddToCart = () => {
    addIngredientsToCart(ingredients);
    setMessage("✅ Ingrédients ajoutés à votre liste de courses !");
    setTimeout(() => setMessage(null), 3000);
  };

  // Signaler les ingrédients manquants
  const handleReportMissingIngredients = async () => {
    if (reported || missingIngredients.length === 0) return;

    try {
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
    } catch (error) {
      console.error("Erreur lors du signalement :", error);
      setMessage("❌ Erreur lors du signalement.");
    }
  };

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">🔄 Chargement...</div>;
  }

  return (
    <div className="flex flex-col items-center p-8">
      <ImageUploader onImageUpload={handleUpload} />

      {ingredients.length > 0 && (
        <div className="mt-6 p-4 border rounded-md shadow-md bg-white max-w-md">
          <h2 className="text-xl font-semibold mb-2">🍽️ Ingrédients détectés :</h2>
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
          <p className="mb-2 font-semibold">⚠️ Certains ingrédients ne sont pas en base :</p>
          <ul className="list-disc pl-5">
            {missingIngredients.map((ing, index) => (
              <li key={index}>{ing}</li>
            ))}
          </ul>
          <button
            onClick={handleReportMissingIngredients}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded transition hover:bg-red-600"
          >
            🚨 Signaler
          </button>
        </div>
      )}
    </div>
  );
}
