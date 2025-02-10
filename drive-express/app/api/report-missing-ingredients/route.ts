import { sendMissingIngredientsEmail } from "@/lib/mailjet";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { missingIngredients } = await req.json();

    if (!missingIngredients || !Array.isArray(missingIngredients) || missingIngredients.length === 0) {
      return new Response(JSON.stringify({ error: "Aucun ingrédient à signaler" }), { status: 400 });
    }

    const adminEmail = "driveexpresseemi@gmail.com";
    await sendMissingIngredientsEmail(adminEmail, missingIngredients);

    return new Response(JSON.stringify({ message: "Ingrédients signalés avec succès" }), { status: 200 });
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du signalement :", error);
    return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), { status: 500 });
  }
}
