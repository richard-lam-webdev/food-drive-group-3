import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Stripe from "stripe";

// Initialisation de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function POST(request: Request) {
  // Vérifier que l'utilisateur est authentifié
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Récupérer les données du corps de la requête
  const { cartItems, subTotal, fraisLivraison } = await request.json();

  // Pour réduire la taille de la metadata, on ne conserve que les informations essentielles
  const minimalCartItems = cartItems.map((item: any) => ({
    id: item.id,
    quantite: item.quantite,
    prix: item.prix,
  }));

  // Construction des line_items pour Stripe
  const line_items = cartItems.map((item: any) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.nom,
      },
      // Stripe attend un montant en centimes
      unit_amount: Math.round(item.prix * 100),
    },
    quantity: item.quantite,
  }));

  // Ajouter les frais de livraison comme un item séparé (si applicable)
  if (fraisLivraison > 0) {
    line_items.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Frais de livraison",
        },
        unit_amount: Math.round(fraisLivraison * 100),
      },
      quantity: 1,
    });
  }

  try {
    // Création de la session de paiement Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      // Redirection après paiement réussi
      success_url: `${request.headers.get("origin")}/panier/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      // Redirection en cas d'annulation
      cancel_url: `${request.headers.get("origin")}/panier/paiement?cancel=true`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id?.toString(),
        // On envoie uniquement les informations minimales pour éviter de dépasser la limite de 500 caractères
        cartItems: JSON.stringify(minimalCartItems),
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error: any) {
    console.error("Erreur lors de la création du checkout session :", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
