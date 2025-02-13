import mailjet from 'node-mailjet';

// Si le module a une propriété default, on l'utilise, sinon on utilise directement mailjetModule.
const mailjetClient = new mailjet({
  apiKey: process.env.MAILJET_API_PUBLIC_KEY,
  apiSecret: process.env.MAILJET_API_PRIVATE_KEY
});



export async function sendConfirmationEmail(to: string, commandeId: number) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const request = mailjetClient
      .post("send", { version: "v3.1" })
      .request({
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
            Subject: "Confirmation de commande",
            TextPart: `Votre commande (ID: ${commandeId}) a été validée avec succès. Merci pour votre achat !`,
            HTMLPart: `<p>Votre commande (ID: <strong>${commandeId}</strong>) a été validée avec succès. Merci pour votre achat !</p>`,
          },
        ],
      });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
  }
}

export async function sendMissingIngredientsEmail(to: string, ingredients: string[]) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email d'ingrédients manquants :", error);
  }
}
