import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Use Microlink API for screenshots (free tier, no API key needed)
    // Don't use embed parameter - get JSON response with screenshot URL
    const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false`;

    const response = await fetch(screenshotUrl);
    const data = await response.json();

    if (data.status !== "success" || !data.data?.screenshot?.url) {
      console.error("Microlink error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to capture screenshot. Try uploading manually." },
        { status: 500 }
      );
    }

    const imageUrl = data.data.screenshot.url;

    // Fetch the actual image and convert to base64
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error("Failed to fetch screenshot image");
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString("base64");

    return NextResponse.json({
      image: base64,
      mimeType: "image/png",
    });

  } catch (error) {
    console.error("Screenshot API error:", error);
    return NextResponse.json(
      { error: "Failed to capture screenshot. Try uploading manually." },
      { status: 500 }
    );
  }
}
