import OpenAI from "openai";

const API_KEYS = [
  process.env.AI_KEY_1,
  process.env.AI_KEY_2,
  process.env.AI_KEY_3,
  process.env.AI_KEY_4,
  process.env.AI_KEY_5,
].filter(Boolean) as string[];

export async function getAIResponse(prompt: string, systemInstruction?: string) {
  if (API_KEYS.length === 0) {
    throw new Error("No OpenAI API keys configured");
  }

  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const openai = new OpenAI({ apiKey: API_KEYS[i] });
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          ...(systemInstruction ? [{ role: "system" as const, content: systemInstruction }] : []),
          { role: "user" as const, content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error(`AI Key ${i + 1} failed:`, error);
      if (i === API_KEYS.length - 1) {
        throw new Error("Error connecting to ChiboyDatabase");
      }
    }
  }
}
