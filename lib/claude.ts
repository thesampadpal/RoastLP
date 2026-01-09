export interface RoastResponse {
  copyRoast: string;
  designRoast: string;
  slopScore: number;
  slopSignals: string[];
  fixFirst: string;
}

export function parseRoastResponse(response: string): RoastResponse {
  try {
    // Remove markdown code blocks if present
    let cleanResponse = response.replace(/```json/gi, "").replace(/```/g, "").trim();

    // Find the JSON object bounds
    const firstBrace = cleanResponse.indexOf('{');
    const lastBrace = cleanResponse.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonStr = cleanResponse.substring(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(jsonStr);

      // Convert designPatterns array to a readable string
      const designPatterns = Array.isArray(parsed.designPatterns)
        ? parsed.designPatterns.join(", ")
        : parsed.designPatterns || parsed.designRoast || "No specific patterns noted";

      return {
        copyRoast: parsed.copyRoast || "The copy was so generic our parser fell asleep.",
        designRoast: designPatterns,
        slopScore: Math.min(100, Math.max(0, parsed.slopScore || parsed.copySlopScore || 50)),
        slopSignals: Array.isArray(parsed.slopSignals)
          ? parsed.slopSignals
          : Array.isArray(parsed.copySlopSignals)
            ? parsed.copySlopSignals
            : ["No specific signals detected"],
        fixFirst: parsed.fixFirst || "Review the copy for specificity.",
      };
    }
    throw new Error("No JSON found");
  } catch (e) {
    console.error("Parse error:", e);
    return {
      copyRoast: "Error analyzing response.",
      designRoast: response || "Analysis failed.",
      slopScore: 50,
      slopSignals: ["Parsing Error"],
      fixFirst: "Try again with a clearer screenshot.",
    };
  }
}
