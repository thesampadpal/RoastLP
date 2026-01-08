import { NextRequest, NextResponse } from "next/server";
import { ROAST_SYSTEM_PROMPT, ROAST_USER_PROMPT } from "@/lib/prompts";
import { parseRoastResponse } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { image, mimeType } = await request.json();

    // Validation
    if (!image || !mimeType) {
      return NextResponse.json(
        { error: "Missing image data" },
        { status: 400 }
      );
    }

    // Validate mime type
    const validMimeTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!validMimeTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: "Invalid image type. Use PNG, JPG, WebP, or GIF." },
        { status: 400 }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Roast My Landing Page",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          {
            role: "system",
            content: ROAST_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${image}`,
                },
              },
              {
                type: "text",
                text: ROAST_USER_PROMPT,
              },
            ],
          },
        ],
        max_tokens: 1024,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter error:", errorData);
      throw new Error(errorData.error?.message || "API request failed");
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || "";
    const parsed = parseRoastResponse(responseText);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Roast API error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("rate") || errorMessage.includes("429")) {
      return NextResponse.json(
        { error: "Rate limited. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate roast. Please try again." },
      { status: 500 }
    );
  }
}
