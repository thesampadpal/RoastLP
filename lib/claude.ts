export interface RoastResponse {
  copyRoast: string;
  designRoast: string;
  slopScore: number;
  slopSignals: string[];
  fixFirst: string;
}

export function parseRoastResponse(response: string): RoastResponse {
  try {
    // 1. Remove markdown code blocks if present (common with Gemini/Claude)
    let cleanResponse = response.replace(/```json/gi, "").replace(/```/g, "").trim();

    // 2. Find the JSON object bounds
    const firstBrace = cleanResponse.indexOf('{');
    const lastBrace = cleanResponse.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonStr = cleanResponse.substring(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(jsonStr);

      return {
        copyRoast: parsed.copyRoast || "The copy was so generic our parser fell asleep.",
        designRoast: parsed.designRoast || "The design broke our roast machine.",
        slopScore: Math.min(100, Math.max(0, parsed.slopScore || 50)),
        slopSignals: Array.isArray(parsed.slopSignals) ? parsed.slopSignals : ["Generic vibe"],
        fixFirst: parsed.fixFirst || "Just start over.",
      };
    }
    throw new Error("No JSON found");
  } catch (e) {
    // Fallback if JSON parsing fails - treat entire response as a generic roast
    return {
      copyRoast: "Error analyzing response.",
      designRoast: response || "Even our AI is speechless. That's not a good sign.",
      slopScore: 50,
      slopSignals: ["Parsing Error", "AI Confusion"],
      fixFirst: "Try again.",
    };
  }
}
