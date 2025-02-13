import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import Stripe from "stripe";

interface CartItem {
  id: string | number;
  quantite: number;
  prix: number;
  nom: string;
}

interface MinimalCartItem extends Omit<CartItem, 'nom'> {
  id: string | number;
  quantite: number;
  prix: number;
}

interface RequestBody {
  cartItems: CartItem[];
  fraisLivraison: number;
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-01-27.acacia", 
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { cartItems, fraisLivraison } = (await request.json()) as RequestBody;

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map((item) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.nom,
      },
      unit_amount: Math.round(item.prix * 100),
    },
    quantity: item.quantite,
  }));

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
    const origin = request.headers.get("origin") || "";
    
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/panier/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/panier/paiement?cancel=true`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id?.toString(),
        cartItems: JSON.stringify(
          cartItems.map<MinimalCartItem>(({ id, quantite, prix }) => ({
            id,
            quantite,
            prix
          })
        ))
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error("Erreur Stripe:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `Échec du paiement: ${errorMessage}` }, 
      { status: 500 }
    );
  }
}