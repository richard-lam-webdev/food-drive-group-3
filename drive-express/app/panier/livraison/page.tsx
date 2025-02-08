"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

export default function LivraisonPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cartItems } = useCart();

  // Optionnel : on stocke localement l’adresse
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [ville, setVille] = useState("");
  const [telephone, setTelephone] = useState("");

  useEffect(() => {
    // Si pas de session => on renvoie sur /panier (ou on refait le pop-up)
    if (!session) router.push("/panier");
    // Si panier vide => on renvoie sur /panier
    if (cartItems.length === 0) router.push("/panier");
  }, [session, cartItems, router]);

  const handleNextStep = () => {
    // Ici, tu pourrais stocker l'adresse dans le localStorage, un context, ou l'envoyer à un backend
    // Par exemple:
    // localStorage.setItem("shippingInfo", JSON.stringify({ nom, adresse, codePostal, ville, telephone }));

    router.push("/panier/paiement");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-8">
        Adresse de Livraison
      </h1>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleNextStep();
        }}
      >
        <div>
          <label className="block font-semibold mb-1">Nom</label>
          <input
            type="text"
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Adresse</label>
          <input
            type="text"
            required
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Code Postal</label>
            <input
              type="text"
              required
              value={codePostal}
              onChange={(e) => setCodePostal(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Ville</label>
            <input
              type="text"
              required
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Téléphone</label>
          <input
            type="text"
            required
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white w-full p-3 rounded hover:bg-green-700 mt-4"
        >
          Continuer
        </button>
      </form>
    </div>
  );
}
