import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { sendConfirmationEmail } from "@/lib/mailjet";

// Déclaration des types
interface CartItem {
  id: string | number;
  quantite: number;
  prix: number;
}

interface StripeMetadata {
  userId?: string;
  cartItems?: string;
}

// Vérification de la clé Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-09-30.acacia",
});

export async function POST(request: Request) {
  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Signature manquante", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Erreur inconnue");
    console.error("Erreur de vérification webhook:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const metadata = checkoutSession.metadata as StripeMetadata;

    // Validation des métadonnées
    if (!metadata?.userId || !metadata.cartItems) {
      console.error("Métadonnées incomplètes");
      return new NextResponse("Données de commande invalides", { status: 400 });
    }

    try {
      // Conversion des données
      const userId = parseInt(metadata.userId, 10);
      const cartItems: CartItem[] = JSON.parse(metadata.cartItems);
      const totalAmount = checkoutSession.amount_total ? checkoutSession.amount_total / 100 : 0;

      // Gestion de la commande
      const commande = await prisma.$transaction(async (tx) => {
        // Recherche ou création de la commande
        let commande = await tx.commandes.findFirst({
          where: { user_id: userId, statut: "panier" },
        });

        if (commande) {
          await tx.lignesCommandes.deleteMany({ where: { order_id: commande.id } });
        } else {
          commande = await tx.commandes.create({
            data: {
              user_id: userId,
              total: totalAmount,
              statut: "payee",
            },
          });
        }

        // Création des lignes de commande
        await tx.lignesCommandes.createMany({
          data: cartItems.map(item => ({
            order_id: commande.id,
            product_id: Number(item.id),
            quantite: item.quantite,
            prix_unitaire: item.prix,
          })),
        });

        // Mise à jour du stock
        await Promise.all(
          cartItems.map(item =>
            tx.produits.update({
              where: { id: Number(item.id) },
              data: { quantite_stock: { decrement: item.quantite } },
            })
          )
        );

        return tx.commandes.update({
          where: { id: commande.id },
          data: { total: cartItems.reduce((acc, item) => acc + item.prix * item.quantite, 0) },
          include: { LignesCommandes: true },
        });
      });

      // Envoi d'email
      if (checkoutSession.customer_email) {
        await sendConfirmationEmail(checkoutSession.customer_email, commande.id);
      }

    } catch (error) {
      console.error("Erreur de traitement:", error);
      return new NextResponse("Erreur de traitement", { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}