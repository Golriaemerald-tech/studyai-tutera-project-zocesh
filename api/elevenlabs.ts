import type { VercelRequest, VercelResponse } from "@vercel/node";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_ENDPOINT = "https://api.elevenlabs.io";

interface SpeakBody {
  text?: string;
  voiceId?: string;
}

async function resolveVoiceId(requestedVoiceId?: string): Promise<string> {
  if (requestedVoiceId?.trim()) {
    return requestedVoiceId.trim();
  }

  const response = await fetch(
    `${ELEVENLABS_ENDPOINT}/v2/voices?language=en&page_size=10`,
    {
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY as string,
      },
    },
  );

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(
      `Could not list ElevenLabs voices (${response.status})${
        details ? `: ${details.slice(0, 300)}` : ""
      }`,
    );
  }

  const data = (await response.json()) as {
    voices?: Array<{
      voice_id?: string;
      name?: string;
    }>;
  };

  const voices = Array.isArray(data.voices) ? data.voices : [];
  const voice = voices.find((item) => item.voice_id);

  if (!voice?.voice_id) {
    throw new Error(
      "No usable English voice is available in the ElevenLabs account.",
    );
  }

  return voice.voice_id;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
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
    return res.status(400).json({
      error: "Missing 'text' in request body.",
    });
  }

  if (text.length > 5000) {
    return res.status(400).json({
      error: "Text too long (max 5000 characters).",
    });
  }

  try {
    const voiceId = await resolveVoiceId(body.voiceId);

    const upstream = await fetch(
      `${ELEVENLABS_ENDPOINT}/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
      {
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
            style: 0,
            use_speaker_boost: false,
          },
        }),
      },
    );

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => "");

      let details = "";

      try {
        const parsed = JSON.parse(errText);
        details =
          parsed?.detail?.message ||
          parsed?.detail ||
          parsed?.message ||
          parsed?.error ||
          "";

        if (typeof details !== "string") {
          details = JSON.stringify(details);
        }
      } catch {
        details = errText.slice(0, 300);
      }

      const message =
        upstream.status === 401 || upstream.status === 403
          ? "ElevenLabs authentication failed (invalid API key or permission)."
          : upstream.status === 429
            ? "ElevenLabs rate limit reached. Please try again shortly."
            : `ElevenLabs request failed (${upstream.status})${
                details ? `: ${details}` : "."
              }`;

      return res.status(upstream.status).json({
        error: message,
      });
    }

    const audioBuffer = Buffer.from(await upstream.arrayBuffer());

    if (audioBuffer.length === 0) {
      return res.status(502).json({
        error: "ElevenLabs returned empty audio.",
      });
    }

    const contentType =
      upstream.headers.get("content-type") || "audio/mpeg";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", audioBuffer.length.toString());
    res.setHeader("Cache-Control", "no-store");

    return res.status(200).send(audioBuffer);
  } catch (error: any) {
    console.error("ElevenLabs server error:", error);

    return res.status(502).json({
      error:
        error?.message ||
        "Couldn't reach ElevenLabs. The voice feature is unavailable.",
    });
  }
}
