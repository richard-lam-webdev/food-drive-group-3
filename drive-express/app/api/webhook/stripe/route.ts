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

    let commande;
    try {
      // Vérifier s'il existe déjà une commande en "panier" pour cet utilisateur
      commande = await prisma.commandes.findFirst({
        where: { user_id: parseInt(userId), statut: "panier" },
      });

      if (commande) {
        console.log("Commande en cours trouvée, mise à jour de la commande existante...");
        // Supprimer les anciennes lignes du panier
        await prisma.lignesCommandes.deleteMany({
          where: { order_id: commande.id },
        });
        // Créer les nouvelles lignes du panier
        const newLignes = cartItems.map(item => ({
          order_id: commande.id,
          product_id: item.id,
          quantite: item.quantite,
          prix_unitaire: item.prix,
        }));
        await prisma.lignesCommandes.createMany({ data: newLignes });
        // Recalculer le total
        const total = cartItems.reduce((acc: number, item: any) => acc + item.prix * item.quantite, 0);
        // Mettre à jour la commande en changeant son statut en "payee"
        commande = await prisma.commandes.update({
          where: { id: commande.id },
          data: { total, statut: "payee" },
        });
      } else {
        console.log("Aucun panier existant trouvé, création d'une nouvelle commande...");
        // Créer une nouvelle commande avec le statut "payee"
        commande = await prisma.commandes.create({
          data: {
            user_id: parseInt(userId),
            total: totalAmount,
            statut: "payee",
            LignesCommandes: {
              create: cartItems.map(item => ({
                product_id: item.id,
                quantite: item.quantite,
                prix_unitaire: item.prix,
              })),
            },
          },
        });
      }
      console.log("Commande créée/mise à jour :", commande);
    } catch (error) {
      console.error("Erreur lors de la création/mise à jour de la commande dans la DB :", error);
    }

    // Mise à jour du stock pour chaque produit acheté
    for (const item of cartItems) {
      try {
        await prisma.produits.update({
          where: { id: item.id },
          data: { quantite_stock: { decrement: item.quantite } },
        });
        console.log(`Stock mis à jour pour le produit ${item.id}`);
      } catch (error) {
        console.error(`Erreur lors de la mise à jour du stock pour le produit ${item.id}:`, error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
