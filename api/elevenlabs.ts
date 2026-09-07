import type { VercelRequest, VercelResponse } from "@vercel/node";

// Server-side only — never exposed to the browser. Set this in your
// Vercel project's Environment Variables as ELEVENLABS_API_KEY.
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Default voice ID (ElevenLabs "Alice" — a clear, neutral English voice
// suitable for a Nigerian secondary-school tutor). Can be overridden per
// request via the `voiceId` body field.
const DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDpCoM";

const ELEVENLABS_ENDPOINT = "https://api.elevenlabs.io/v1";

interface SpeakBody {
  text?: string;
  voiceId?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!ELEVENLABS_API_KEY) {
    return res.status(503).json({
      error: "ElevenLabs API key is not configured on the server.",
    });
  }

  const body: SpeakBody = req.body || {};
  const text = String(body.text || "").trim();
  if (!text) {
    return res.status(400).json({ error: "Missing 'text' in request body." });
  }

  // Keep responses reasonable for a chatbot turn.
  if (text.length > 5000) {
    return res.status(400).json({ error: "Text too long (max 5000 characters)." });
  }

  const voiceId = body.voiceId || DEFAULT_VOICE_ID;
  const url = `${ELEVENLABS_ENDPOINT}/text-to-speech/${encodeURIComponent(voiceId)}`;

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          speaking_rate: 1.0,
          style: 0.0,
          use_speaker_boost: false,
        },
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      const msg =
        upstream.status === 401 || upstream.status === 403
          ? "ElevenLabs authentication failed (invalid API key)."
          : upstream.status === 429
            ? "ElevenLabs rate limit reached. Please try again shortly."
            : `ElevenLabs request failed (${upstream.status}).`;
      return res.status(upstream.status).json({ error: msg });
    }

    const contentType = upstream.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      // Some ElevenLabs error responses come back as JSON even with 200
      const data: any = await upstream.json().catch(() => null);
      if (data?.error) {
        return res.status(502).json({ error: data.error });
      }
    }

    // Stream the raw audio binary back to the client as MPEG audio.
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    upstream.body?.pipe(res);
  } catch (err: any) {
    return res.status(502).json({
      error: "Couldn't reach ElevenLabs. The voice feature is unavailable.",
    });
  }
}
