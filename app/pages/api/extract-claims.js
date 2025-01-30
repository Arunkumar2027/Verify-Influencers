import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text } = req.body;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await openai.completions.create({
      model: "gpt-4",
      prompt: `Extract health-related claims from the following text: ${text}`,
      max_tokens: 200
    });

    res.status(200).json(completion.choices[0].text.trim().split("\n"));
  } catch (error) {
    res.status(500).json({ error: "Error extracting claims" });
  }
}
