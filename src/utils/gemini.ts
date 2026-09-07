// NOTE: this used to call the Gemini API directly from the browser with
// VITE_GEMINI_API_KEY (actually mistyped as VITE_GEMINII_API_KEY), which
// ships your API key inside the public JS bundle for anyone to steal.
// It's now a thin wrapper around the secure /api/chat serverless function
// (see src/lib/gemini.ts), which keeps the key server-side and gets the
// automatic multi-model fallback chain for free.
import { ask, GeminiError } from "../lib/gemini";

export const callGeminiAPI = async (prompt: string, systemInstruction?: string): Promise<string> => {
  try {
    return await ask(prompt, { systemInstruction });
  } catch (err) {
    if (err instanceof GeminiError) return err.message;
    return "Error generating response from AI service.";
  }
};
