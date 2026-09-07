import type { VercelRequest, VercelResponse } from "@vercel/node";

// Server-side only — never exposed to the browser. Set this in your
// Vercel project's Environment Variables as GEMINI_API_KEY.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/";

// Free-tier Gemini API keys hit per-model rate limits fast, and any single
// model can be temporarily overloaded (503) or briefly unavailable (404) on
// a given account. Instead of failing the whole request, we try a chain of
// models in order and return the first one that actually answers.
//
// The primary model is whatever's set in the Vercel env var GEMINI_MODEL
// (defaults to the one requested for this project). The rest are fallbacks,
// roughly newest/cheapest-first, deduplicated in case the primary already
// appears in the list.
const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const FALLBACK_CHAIN = [
  PRIMARY_MODEL,
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-3.8-flash",
].filter((model, idx, arr) => arr.indexOf(model) === idx);

// Errors worth retrying against the next model in the chain. A 400 (bad
// request) is NOT included — that means our request body itself is wrong,
// so retrying with a different model would just fail the same way.
function isRetryable(status: number): boolean {
  return status === 404 || status === 429 || status >= 500;
}

interface ChatBody {
  prompt?: string;
  systemInstruction?: string;
  maxOutputTokens?: number;
}

function extractText(data: any): string {
  const candidates = Array.isArray(data?.candidates) ? data.candidates : [];
  for (const candidate of candidates) {
    const parts = candidate?.content?.parts;
    if (Array.isArray(parts)) {
      const text = parts
        .map((p: any) => (typeof p?.text === "string" ? p.text : ""))
        .join("")
        .trim();
      if (text) return text;
    }
  }
  if (typeof data?.text === "string" && data.text.trim()) return data.text.trim();
  return "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      error:
        "GEMINI_API_KEY is not configured on the server. Add it in your Vercel project's Environment Variables.",
    });
  }

  const body: ChatBody = req.body || {};
  const prompt = String(body.prompt || "").trim();
  if (!prompt) {
    return res.status(400).json({ error: "Missing 'prompt' in request body." });
  }

  const requestBody = {
    systemInstruction: {
      parts: [
        {
          text:
            body.systemInstruction ||
            "You are Zocesh Study AI, a patient Nigerian secondary-school tutor. Address the student naturally and respectfully. Never use titles such as sir, ma, madam, or any gendered title unless the user explicitly asks you to.",
        },
      ],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      maxOutputTokens: Number(body.maxOutputTokens) || 2048,
    },
  };

  // Allow a caller to pin a specific model; otherwise walk the fallback chain.
  const chain = body && (body as any).model ? [(body as any).model as string] : FALLBACK_CHAIN;

  let lastStatus = 502;
  let lastMessage = "Couldn't reach Gemini. Please try again shortly.";
  let lastRaw = "";

  for (let i = 0; i < chain.length; i++) {
    const model = chain[i];
    const url = `${GEMINI_ENDPOINT}${encodeURIComponent(model)}:generateContent`;

    try {
      const upstream = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify(requestBody),
      });

      let data: any = null;
      try {
        data = await upstream.json();
      } catch {
        // non-JSON upstream response, handled below
      }

      if (!upstream.ok) {
        const raw = typeof data === "string" ? data : JSON.stringify(data || {});
        lastStatus = upstream.status;
        lastRaw = raw;

        if (upstream.status === 400) lastMessage = "Gemini rejected the request. Check the model or request settings.";
        else if (upstream.status === 401 || upstream.status === 403)
          lastMessage = "Gemini could not authenticate the server's API key.";
        else if (upstream.status === 404) lastMessage = `The model "${model}" was not found for this API key.`;
        else if (upstream.status === 429) lastMessage = "Gemini rate limit reached on every configured model. Please try again shortly.";
        else if (upstream.status >= 500) lastMessage = "Gemini is temporarily unavailable.";
        if (/quota|resource.?exhausted/i.test(raw)) lastMessage = "Your Gemini API quota has been reached on every configured model.";

        // Auth errors (401/403) won't be fixed by trying another model —
        // the key itself is the problem, so stop immediately.
        if (upstream.status === 401 || upstream.status === 403) {
          return res.status(upstream.status).json({ error: lastMessage });
        }

        // If this model failed for a retryable reason and we have more
        // models left, move on to the next one in the chain.
        if (isRetryable(upstream.status) && i < chain.length - 1) {
          continue;
        }

        return res.status(upstream.status).json({ error: lastMessage });
      }

      const text = extractText(data);
      if (!text) {
        lastStatus = 502;
        lastMessage = "Gemini returned an empty or unexpected response.";
        if (i < chain.length - 1) continue;
        return res.status(502).json({ error: lastMessage });
      }

      // Success — report which model actually answered, useful for debugging.
      return res.status(200).json({ text, model });
    } catch (err: any) {
      lastStatus = 502;
      lastMessage = "Couldn't reach Gemini. Please try again shortly.";
      if (i < chain.length - 1) continue;
      return res.status(lastStatus).json({ error: lastMessage });
    }
  }

  return res.status(lastStatus).json({ error: lastMessage || lastRaw || "All Gemini models failed." });
}
