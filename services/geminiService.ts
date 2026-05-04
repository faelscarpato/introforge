import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnimationConfig, AnimationType } from "../types";

// Define the schema for the AI response to ensure type safety
const animationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "The main headline text for the intro." },
    subText: { type: Type.STRING, description: "A supporting sub-headline or tag line." },
    type: { 
      type: Type.STRING, 
      enum: Object.values(AnimationType),
      description: "The type of animation effect. Use 'svg_stroke' for elegant line drawing, 'elastic_pop' for energetic branding, or 'glitch' for cyber themes." 
    },
    duration: { type: Type.NUMBER, description: "Duration in seconds (0.5 to 3.0)." },
    delay: { type: Type.NUMBER, description: "Delay before start in seconds." },
    backgroundColor: { type: Type.STRING, description: "Hex color code for background." },
    textColor: { type: Type.STRING, description: "Hex color code for main text." },
    accentColor: { type: Type.STRING, description: "Hex color code for accents/subtext." },
    fontSize: { type: Type.NUMBER, description: "Font size in pixels (20 to 120)." },
    letterSpacing: { type: Type.NUMBER, description: "Letter spacing in pixels (-2 to 20)." },
    easing: { type: Type.STRING, description: "CSS easing function name (e.g., easeOut, easeInOut)." }
  },
  required: ["text", "type", "backgroundColor", "textColor"],
};

export const generateAnimationConfig = async (prompt: string): Promise<Partial<AnimationConfig>> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found in environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
      You are an expert UI/UX Motion Designer. 
      Your goal is to generate modern, high-quality website intro animation configurations based on user descriptions.
      Focus on aesthetics, contrast, and readability.
      
      Animation Types:
      - 'svg_stroke': Classy, elegant, draws the text outline then fills it. Great for luxury or architectural sites.
      - 'elastic_pop': Bouncy, fun, energetic. Great for startups and creative agencies.
      - 'glitch': Tech, cyber, edgy.
      - 'blur_reveal': Modern, clean, cinematic.

      If the user asks for a specific style (e.g., 'Cyberpunk', 'Minimalist', 'Corporate'), adjust colors and typography accordingly.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: animationSchema,
        temperature: 0.7, 
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(jsonText) as Partial<AnimationConfig>;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};