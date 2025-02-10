// lib/mailjet.ts
import mailjet from 'node-mailjet';

// Si le module a une propriété default, on l'utilise, sinon on utilise directement mailjetModule.
const mailjetClient = new mailjet({
  apiKey: process.env.MAILJET_API_PUBLIC_KEY,
  apiSecret: process.env.MAILJET_API_PRIVATE_KEY
});



export async function sendConfirmationEmail(to: string, commandeId: number) {
  try {
    console.log("Envoi de l'email de confirmation à", to);
    console.log("commandeId", commandeId);
    console.log("mailjetClient", mailjetClient);
    const request = mailjetClient
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: "driveexpresseemi@gmail.com", // L'adresse e-mail de l'expéditeur
              Name: "Drive Express",
            },
            To: [
              {
                Email: to, // L'adresse e-mail du client
                Name: "",   // Vous pouvez renseigner le nom du client si disponible
              },
            ],
            Subject: "Confirmation de commande",
            TextPart: `Votre commande (ID: ${commandeId}) a été validée avec succès. Merci pour votre achat !`,
            HTMLPart: `<p>Votre commande (ID: <strong>${commandeId}</strong>) a été validée avec succès. Merci pour votre achat !</p>`,
          },
        ],
      });
    const result = await request;
    console.log("request", request);
    console.log("Email envoyé:", result.body);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
  }
}

export async function sendMissingIngredientsEmail(to: string, ingredients: string[]) {
  try {
    const request = await mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "driveexpresseemi@gmail.com",
            Name: "Drive Express",
          },
          To: [
            {
              Email: to,
              Name: "",
            },
          ],
          Subject: "⚠️ Ingrédients manquants détectés",
          TextPart: `Les ingrédients suivants ne sont pas présents en base de données :\n${ingredients.join("\n")}`,
          HTMLPart: `
            <h3>⚠️ Ingrédients manquants détectés</h3>
            <p>Les ingrédients suivants ne sont pas présents en base :</p>
            <ul>
              ${ingredients.map((ing) => `<li><strong>${ing}</strong></li>`).join("")}
            </ul>
            <p>Merci de les ajouter si nécessaire.</p>
          `,
        },
      ],
    });
    console.log("📧 Email d'alerte envoyé aux admins :", request.body);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email d'ingrédients manquants :", error);
  }
}
