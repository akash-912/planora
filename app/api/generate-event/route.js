import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

// 1. Consistent environment variable check
if (!process.env.GROQ_API_KEY) {
  console.error("CRITICAL: GROQ_API_KEY is missing from .env.local");
}

// 2. Initialized strictly with process.env and removed the browser flag
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req) {
  try {
    // 3. Removed Vite-specific env checks
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Groq API key is not configured in env");
    }
    
    const { prompt } = await req.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // 4. Removed the duplicated prompt injection at the bottom of the system instructions
    const systemPrompt = `You are an event planning assistant. Generate event details based on the user's description.

CRITICAL: Return ONLY valid JSON with properly escaped strings. No newlines in string values - use spaces instead.

Return this exact JSON structure:
{
  "title": "Event title (catchy and professional, single line)",
  "description": "Detailed event description in a single paragraph. Use spaces instead of line breaks. Make it 2-3 sentences describing what attendees will learn and experience.",
  "category": "One of: tech, music, sports, art, food, business, health, education, gaming, networking, outdoor, community",
  "suggestedCapacity": 50,
  "suggestedTicketType": "free"
}

Rules:
- Return ONLY the JSON object, no markdown, no explanation
- All string values must be on a single line with no line breaks
- Use spaces instead of \\n or line breaks in description
- Make title catchy and under 80 characters
- Description should be 2-3 sentences, informative, single paragraph
- suggestedTicketType should be either "free" or "paid"
`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `User's event idea: ${prompt}` } // This handles the user prompt correctly
      ],
      model: 'groq/compound',
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content;

    // Clean the response (remove markdown code blocks if present)
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    const eventData = JSON.parse(cleanedText);

    return NextResponse.json(eventData);

  } catch (error) {
    console.error("Error generating event:", error);
    return NextResponse.json(
      { error: "Failed to generate event: " + error.message },
      { status: 500 }
    );
  }
}