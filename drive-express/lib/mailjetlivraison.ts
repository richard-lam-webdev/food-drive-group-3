// lib/mailjet.ts
import mailjet from 'node-mailjet';

const mailjetClient = new mailjet({
  apiKey: process.env.MAILJET_API_PUBLIC_KEY,
  apiSecret: process.env.MAILJET_API_PRIVATE_KEY
});

export async function sendDispatchEmail(to: string, orderId: number) {
  try {
    const request = await mailjetClient
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: "driveexpresseemi@gmail.com", // Utilisez une adresse vérifiée sur Mailjet
              Name: "Drive Express",
            },
            To: [
              {
                Email: to,
                Name: "Client",
              },
            ],
            Subject: "Votre commande est en cours d'expédition",
            TextPart: `Votre commande (ID: ${orderId}) a été expédiée. Vous recevrez bientôt vos produits.`,
            HTMLPart: `<p>Votre commande (ID: <strong>${orderId}</strong>) a été expédiée. Vous recevrez bientôt vos produits. Merci pour votre confiance !</p>`,
          },
        ],
      });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de dispatch:", error);
  }
}
