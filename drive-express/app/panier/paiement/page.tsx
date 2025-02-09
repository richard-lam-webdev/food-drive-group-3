"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { loadStripe } from "@stripe/stripe-js";

// Chargez votre clé publique Stripe depuis l'environnement
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaiementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cartItems, updateCart } = useCart(); 
  const [subTotal, setSubTotal] = useState(0);
  const fraisLivraison = 5; // à ajuster selon vos besoins

  useEffect(() => {
    if (status === "loading") return;
    if (!session || cartItems.length === 0) {
      // Vous pouvez rediriger ou afficher un message
      console.log(session, cartItems);
      // router.push("/panier");
    }
    const total = cartItems.reduce(
      (acc, item) => acc + item.prix * item.quantite,
      0
    );
    setSubTotal(total);
  }, [session, status, cartItems, router]);

  const handlePayment = async () => {
    try {
      // Appeler l'API pour créer une session Stripe
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cartItems, subTotal, fraisLivraison }),
      });
      const data = await res.json();
      if (data.error) {
        console.error(data.error);
        return;
      }
      // Rediriger vers la session de paiement Stripe
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
        if (error) console.error(error);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la session de paiement :", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-8">Paiement</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-bold text-lg mb-4">Récapitulatif de la commande</h2>
        <ul className="mb-4">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between mb-2">
              <span>{item.nom} x {item.quantite}</span>
              <span>{(item.prix * item.quantite).toFixed(2)} €</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between">
          <span>Sous-total</span>
          <span>{subTotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between">
          <span>Frais de Livraison</span>
          <span>{fraisLivraison.toFixed(2)} €</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total :</span>
          <span>{(subTotal + fraisLivraison).toFixed(2)} €</span>
        </div>
      </div>
      <button
        onClick={handlePayment}
        className="bg-green-600 text-white w-full p-4 rounded-lg hover:bg-green-700"
      >
        Valider la commande
      </button>
    </div>
  );
}
