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

    // List of models to try in order of preference
    const MODELS = [
      "google/gemini-2.0-flash-exp:free",
      "google/gemini-2.0-flash-thinking-exp:free",
      "google/gemini-exp-1206:free",
      "meta-llama/llama-3.2-90b-vision-instruct:free",
    ];

    let lastError = null;
    let responseText = "";

    // Try each model until one works
    for (const model of MODELS) {
      try {
        console.log(`Attempting roast with model: ${model}`);

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Roast My Landing Page",
          },
          body: JSON.stringify({
            model: model,
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
          console.warn(`Model ${model} failed:`, errorData);
          throw new Error(errorData.error?.message || `API request to ${model} failed`);
        }

        const data = await response.json();
        responseText = data.choices?.[0]?.message?.content || "";

        if (responseText) {
          console.log(`Successfully generated roast with ${model}`);
          break; // Success! Exit loop
        }
      } catch (err) {
        lastError = err;
        console.warn(`Failed with ${model}, trying next...`);
        // Continue to next model
      }
    }

    if (!responseText) {
      throw lastError || new Error("All models failed to generate a response");
    }

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
