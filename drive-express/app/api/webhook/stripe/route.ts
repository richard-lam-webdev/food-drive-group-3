import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

// Initialisation de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});
const prisma = new PrismaClient();

// Pour certains environnements, désactiver le parsing automatique du body
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  // Récupération du body brut
  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Erreur lors de la vérification du webhook Stripe :", err.message);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  // Traitement de l'événement "checkout.session.completed"
  if (event.type === "checkout.session.completed") {
    console.log("Session de paiement complétée !");
    const checkoutSession = event.data.object as Stripe.Checkout.Session;

    // Récupération des metadata passées lors de la création de la session
    const userId = checkoutSession.metadata?.userId;
    const cartItemsJSON = checkoutSession.metadata?.cartItems;
    let cartItems: any[] = [];
    if (cartItemsJSON) {
      try {
        cartItems = JSON.parse(cartItemsJSON);
      } catch (error) {
        console.error("Erreur lors du parsing des cartItems :", error);
      }
    }

    // Calcul du montant total (Stripe envoie le montant en centimes)
    const totalAmount = checkoutSession.amount_total ? checkoutSession.amount_total / 100 : 0;
    console.log("Commande payée :", totalAmount);

    // Vérifier que le userId est présent et valide
    if (!userId || isNaN(parseInt(userId))) {
      console.error("UserId invalide :", userId);
      return new NextResponse("Webhook Error: UserId invalide", { status: 400 });
    }

    try {
      console.log("Création de la commande dans la DB...");
      // Création de la commande dans la base de données
      const commande = await prisma.commandes.create({
        data: {
          user_id: parseInt(userId),
          total: totalAmount,
          statut: "payee", // Paiement réussi
          LignesCommandes: {
            create: cartItems.map(item => ({
              product_id: item.id,
              quantite: item.quantite,
              prix_unitaire: item.prix,
            })),
          },
        },
      });
      console.log("Commande créée :", commande);
    } catch (error) {
      console.error("Erreur lors de la création de la commande dans la DB :", error);
    }
  }

  return NextResponse.json({ received: true });
}
