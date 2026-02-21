import { getAIResponse } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, name, description } = await req.json();

    const systemInstruction = `You are an expert software architect. 
    Given a project name and description, create a detailed technical plan.
    Return ONLY a JSON object with the following structure:
    {
      "tech_stack": ["string"],
      "file_structure": ["string"],
      "database_schema": "string",
      "dependencies": ["string"],
      "deployment_strategy": "string",
      "summary": "string"
    }`;

    const userPrompt = `Project Name: ${name}\nDescription: ${description}\nUser Request: ${prompt}`;

    const response = await getAIResponse(userPrompt, systemInstruction);
    
    if (!response) throw new Error("No response from AI");

    return NextResponse.json(JSON.parse(response));
  } catch (error: any) {
    console.error("Plan API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
