"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RecipeModal from "./RecipeModal";

export default function CartModal({ onClose }: { onClose: () => void }) {
  const { cartItems, updateCart, addToCart } = useCart();
  const router = useRouter();
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [missingIngredients, setMissingIngredients] = useState<string[]>([]);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  const handleViewCart = () => {
    onClose();
    router.push("/panier");
  };

  const handleSuggestRecipe = async () => {
    setLoadingRecipe(true);
    setRecipe(null);
    setMissingIngredients([]);

    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const data = await res.json();
    setLoadingRecipe(false);

    if (data.error) {
      alert("Erreur lors de la génération de la recette.");
      return;
    }

    setRecipe(data.recipe?.description || "Aucune recette trouvée.");
    setMissingIngredients(data.recipe?.missingIngredients || []);
    setShowRecipeModal(true);
  };

  const handleAddMissingIngredients = async () => {
    if (missingIngredients.length === 0) return;
  
    const res = await fetch("/api/check-ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: missingIngredients }),
    });
  
    const data = await res.json();
    // data.availableIngredients est maintenant un tableau d'objets { id, nom, quantite_stock }
    const availableFromAPI: { id: number; nom: string; quantite_stock: number }[] = data.availableIngredients || [];
  
    const ingredientsAjoutes: string[] = [];
  
    missingIngredients.forEach((ingredient) => {
      const normalizedIngredient = ingredient.replace(/\s*\(.*?\)\s*/g, "").trim().toLowerCase();
  
      // Chercher le produit correspondant en se basant sur le nom normalisé
      const produit = availableFromAPI.find(
        (p) => p.nom.toLowerCase().trim() === normalizedIngredient ||
               p.nom.toLowerCase().trim().includes(normalizedIngredient)
      );
  
      if (produit) {
        const cartItem = cartItems.find(
          (item) => item.nom.toLowerCase().trim() === produit.nom.toLowerCase().trim()
        );
        const currentQty = cartItem ? cartItem.quantite : 0;
  
        if (currentQty < produit.quantite_stock) {
          // Utiliser l'ID réel du produit
          addToCart({ id: produit.id, nom: produit.nom, quantite: 1, prix: 1 });
          ingredientsAjoutes.push(produit.nom);
        } else {
          console.log(
            `${ingredient} a déjà atteint la quantité maximale (stock: ${produit.quantite_stock}).`
          );
        }
      } else {
        console.log(`${ingredient} n'est pas disponible en stock.`);
      }
    });
  
    if (ingredientsAjoutes.length === 0) {
      alert(
        "Aucun ingrédient n'a été ajouté car soit ils ne sont pas disponibles en stock, soit la quantité maximale est déjà atteinte."
      );
    } else {
      alert(
        `Les ingrédients suivants ont été ajoutés : ${ingredientsAjoutes.join(", ")}.`
      );
    }
    setShowRecipeModal(false);
  };  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Votre Panier</h2>

        {cartItems.length > 0 ? (
          <>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800">{item.nom}</p>
                    <p className="text-gray-600 text-sm">
                      {item.prix} € x {item.quantite} ={" "}
                      <span className="font-semibold">
                        {(item.prix * item.quantite).toFixed(2)} €
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateCart(item.id, -1)}
                      className="bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold">{item.quantite}</span>
                    <button
                      onClick={() => updateCart(item.id, 1)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t pt-4">
              <p className="text-right text-lg font-bold text-gray-800">
                Sous-total :{" "}
                <span className="text-green-600">
                  {cartItems
                    .reduce((acc, item) => acc + item.prix * item.quantite, 0)
                    .toFixed(2)}{" "}
                  €
                </span>
              </p>
            </div>

            <button
              onClick={handleViewCart}
              className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 w-full font-bold"
            >
              Voir mon panier
            </button>

            <button
              onClick={handleSuggestRecipe}
              className="mt-4 bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 w-full font-bold"
            >
              {loadingRecipe ? "Recherche de recettes..." : "🍽️ Suggérer des recettes"}
            </button>
          </>
        ) : (
          <p className="text-center text-gray-600">Votre panier est vide.</p>
        )}

        {showRecipeModal && recipe && (
          <RecipeModal 
            recipe={recipe} 
            missingIngredients={missingIngredients} 
            onClose={() => setShowRecipeModal(false)}
            onAddMissing={handleAddMissingIngredients}
          />
        )}

        <button onClick={onClose} className="mt-4 bg-gray-300 p-2 rounded-lg hover:bg-gray-400 w-full">
          Fermer
        </button>
      </div>
    </div>
  );
}
