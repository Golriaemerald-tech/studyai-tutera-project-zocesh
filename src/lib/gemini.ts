export interface AskOptions {
  systemInstruction?: string;
  maxOutputTokens?: number;
}

export interface StudentProfile {
  name?: string;
  nickname?: string;
  studentClass?: string;
  department?: string;
}

/**
 * Builds a system instruction that actually tells the model who it's
 * talking to. Every AI call in the app should route through this so the
 * tutor answers at the right level for the student's class/department
 * instead of giving a generic, one-size-fits-all response.
 */
export function buildTutorInstruction(
  profile: StudentProfile | null | undefined,
  opts: { persona?: string; subject?: string } = {}
): string {
  const persona =
    opts.persona ||
    "You are STUDYAI, a patient Nigerian secondary-school tutor. Address the student naturally as sir.";
  const className = profile?.studentClass || "SS 3";
  const department = profile?.department || "Science";
  const studentName = profile?.nickname || profile?.name;

  const lines = [
    persona,
    `The student you are helping is in class ${className}, ${department} department.` +
      (studentName ? ` Their name is ${studentName}.` : ""),
    `Tailor the depth, vocabulary, and examples of every answer to what a ${className} ${department} student is expected to know — ` +
      `do not assume knowledge from a class above theirs, and do not oversimplify below their level.`,
  ];
  if (opts.subject) {
    lines.push(`The current subject/context is ${opts.subject}.`);
  }
  lines.push(
    "Format responses in Markdown (use **bold**, `code`, and - bullet lists where helpful) — it will be rendered, not shown as raw text."
  );
  return lines.join("\n");
}

export class GeminiError extends Error {
  code: string;
  status?: number;
  constructor(message: string, code: string, status?: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

/**
 * Talks to our own /api/chat serverless function, which holds the
 * Gemini API key server-side (process.env.GEMINI_API_KEY) and forwards
 * the request to Google. The browser never sees the key.
 */
async function callApi(payload: Record<string, unknown>): Promise<string> {
  let response: Response;
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (networkError) {
    throw new GeminiError(
      "Couldn't reach StudyAI's server. Please check your internet connection.",
      "NETWORK_ERROR"
    );
  }

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    // ignore parse failure, handled below
  }

  if (!response.ok) {
    const message =
      (data && typeof data.error === "string" && data.error) ||
      friendlyError(response.status);
    throw new GeminiError(message, "HTTP_ERROR", response.status);
  }

  const text = typeof data?.text === "string" ? data.text.trim() : "";
  if (!text) {
    throw new GeminiError(
      "Gemini returned an empty response. Please try rephrasing your question.",
      "EMPTY_RESPONSE"
    );
  }
  return text;
}

function friendlyError(status: number): string {
  if (status === 400) return "Gemini rejected the request. Please check your settings.";
  if (status === 401 || status === 403) return "The server's Gemini API key is missing or invalid.";
  if (status === 404) return "The Gemini model was not found. Please check the model name.";
  if (status === 429) return "Gemini rate limit reached. Please wait a moment and try again.";
  if (status >= 500) return "Gemini is temporarily unavailable. Please try again shortly.";
  return "Something went wrong talking to Gemini.";
}

export async function ask(prompt: string, options: AskOptions = {}): Promise<string> {
  return callApi({
    prompt,
    systemInstruction:
      options.systemInstruction ||
      "You are STUDYAI, a patient Nigerian secondary-school tutor. Address the student naturally as sir.",
    maxOutputTokens: options.maxOutputTokens || 2048,
  });
}

export async function generateJSON<T = unknown>(
  prompt: string,
  schemaHint: string,
  options: AskOptions = {}
): Promise<T> {
  const instruction =
    (options.systemInstruction || "You are STUDYAI, an educational AI.") +
    "\nReturn ONLY valid JSON. No markdown fences. The JSON must match this shape:\n" +
    schemaHint;
  const text = await ask(prompt, {
    ...options,
    systemInstruction: instruction,
    maxOutputTokens: options.maxOutputTokens || 4096,
  });
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const openers = ["{", "["]
      .map((c) => cleaned.indexOf(c))
      .filter((i) => i >= 0);
    const start = openers.length ? Math.min(...openers) : -1;
    const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }
    throw new GeminiError("Gemini returned malformed JSON.", "INVALID_JSON");
  }
}

export async function testConnection(): Promise<string> {
  return ask("Reply with exactly: STUDYAI Gemini connection successful.", {
    systemInstruction: "You are a connection test. Return exactly the requested text and nothing else.",
    maxOutputTokens: 32,
  });
}
