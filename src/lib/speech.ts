/**
 * Client-side Text-to-Speech utility.
 *
 * Calls our own /api/elevenlabs serverless function, which holds the
 * ElevenLabs API key server-side (process.env.ELEVENLABS_API_KEY) and
 * never exposes it to the browser.
 */

export interface SpeakResult {
  success: boolean;
  audioUrl?: string;
  error?: string;
}

/**
 * Sends `text` to the server-side ElevenLabs proxy and returns an
 * object URL for the generated audio. The caller is responsible for
 * revoking the URL (URL.revokeObjectURL) when done.
 *
 * If the voice API is unavailable, returns { success: false, error }.
 */
export async function speak(text: string): Promise<SpeakResult> {
  if (!text || !text.trim()) {
    return { success: false, error: "No text provided for speech." };
  }

  try {
    const response = await fetch("/api/elevenlabs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.trim().slice(0, 5000) }),
    });

    if (!response.ok) {
      let errorMsg = `ElevenLabs request failed (${response.status}).`;
      try {
        const data = await response.json();
        errorMsg = data.error || errorMsg;
      } catch {
        /* non-JSON error response, use default message */
      }
      return { success: false, error: errorMsg };
    }

    const blob = await response.blob();
    if (blob.size === 0) {
      return { success: false, error: "No audio data received." };
    }

    const audioUrl = URL.createObjectURL(blob);
    return { success: true, audioUrl };
  } catch (err) {
    return {
      success: false,
      error: "Couldn't reach the voice server. Tutor text is still working, sir.",
    };
  }
}

/** Whether the TTS endpoint is available (quick availability check). */
export async function voiceAvailable(): Promise<boolean> {
  try {
    const res = await fetch("/api/elevenlabs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "." }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
