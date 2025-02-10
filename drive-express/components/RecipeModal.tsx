"use client";

import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface RecipeModalProps {
  recipe: string;
  missingIngredients: string[];
  onClose: () => void;
  onAddMissing: () => void;
}

export default function RecipeModal({ recipe, missingIngredients, onClose, onAddMissing }: RecipeModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">🍽️ Recette suggérée</h2>

        <div className="text-gray-800 prose">
          <ReactMarkdown>{recipe}</ReactMarkdown>
        </div>

        {missingIngredients.length > 0 && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
            <h3 className="text-red-600 font-bold flex items-center">
              ❌ Ingrédients manquants :
            </h3>
            <ul className="list-disc pl-5 text-gray-700">
              {missingIngredients.map((ing, index) => (
                <li key={`${ing}-${index}`} className="text-lg">{ing}</li>
              ))}
            </ul>
            <button
              onClick={onAddMissing}
              className="mt-2 bg-green-500 text-white p-2 rounded-lg w-full font-bold"
            >
              Ajouter les ingrédients manquants
            </button>
          </div>
        )}

        <button 
          onClick={onClose}
          className="mt-4 bg-gray-300 p-2 rounded-lg hover:bg-gray-400 w-full font-bold"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
