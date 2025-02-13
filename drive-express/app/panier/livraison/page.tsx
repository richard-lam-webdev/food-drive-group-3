"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

export default function LivraisonPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cartItems } = useCart();

  const [numeroRue, setNumeroRue] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [ville, setVille] = useState("");
  const [saveAddress, setSaveAddress] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || cartItems.length === 0) {
      router.push("/panier");
      return;
    }

    const fetchAdresse = async () => {
      try {
        const res = await fetch("/api/users/getAdresse", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", 
        });
        if (res.ok) {
          const data = await res.json();
          if (data.numeroRue) setNumeroRue(data.numeroRue);
          if (data.codePostal) setCodePostal(data.codePostal);
          if (data.ville) setVille(data.ville);
          setSaveAddress(true);
        } else {
          console.error("Erreur lors de la récupération de l'adresse:", await res.text());
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'adresse:", error);
      }
    };

    fetchAdresse();
  }, [session, status, cartItems, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (saveAddress) {
      try {
        const res = await fetch("/api/users/updateAdresse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", 
          body: JSON.stringify({ numeroRue, codePostal, ville, saveAddress }),
        });
        if (!res.ok) {
          console.error("Erreur lors de la mise à jour de l'adresse");
        }
      } catch (error) {
        console.error(error);
      }
    }

    router.push("/panier/paiement");
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Livraison</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Numéro et rue</label>
          <input
            type="text"
            value={numeroRue}
            onChange={(e) => setNumeroRue(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Code postal</label>
          <input
            type="text"
            value={codePostal}
            onChange={(e) => setCodePostal(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Ville</label>
          <input
            type="text"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={saveAddress}
            onChange={() => setSaveAddress(!saveAddress)}
          />
          <label>Enregistrer cette adresse dans mon compte</label>
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white p-3 rounded mt-4 w-full"
        >
          Continuer vers le Paiement
        </button>
      </form>
    </div>
  );
}
