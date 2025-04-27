import { generateChatResponse } from "@/lib/ai";
import { getCharacterById } from "@/lib/characters";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { characterId, messages } = body;

    // Validate the request
    if (!characterId || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Get the character
    const character = getCharacterById(characterId);
    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    // Generate the response
    const response = await generateChatResponse(
      character.systemPrompt,
      messages
    );

    // Return the response
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process the chat request" },
      { status: 500 }
    );
  }
}