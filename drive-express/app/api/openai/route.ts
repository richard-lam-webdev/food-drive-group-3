import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Aucun prompt fourni." }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    });

    return NextResponse.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Erreur OpenAI :", error);
    return NextResponse.json({ error: "Erreur lors de la requête à OpenAI." }, { status: 500 });
  }
}
