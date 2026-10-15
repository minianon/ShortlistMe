import Groq from "groq-sdk";

/**
 * Which Groq models ShortlistMe uses, in one place.
 *
 * Groq retired llama-3.3-70b-versatile and llama-3.1-8b-instant on 16 Aug 2026,
 * which silently broke resume parsing. Their recommended replacements are the
 * gpt-oss models. GROQ_MODEL / GROQ_FALLBACK_MODEL can still override these,
 * but a retired model name in the env is ignored so it can't break things again.
 */
export const DEFAULT_MODEL = "openai/gpt-oss-120b";
export const DEFAULT_FALLBACK_MODEL = "openai/gpt-oss-20b";

const RETIRED = new Set([
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "llama3-70b-8192",
  "llama3-8b-8192",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
  "qwen/qwen3-32b",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "moonshotai/kimi-k2-instruct-0905",
]);

function pick(envValue: string | undefined, fallback: string) {
  const v = envValue?.trim();
  return v && !RETIRED.has(v) ? v : fallback;
}

export const primaryModel = () => pick(process.env.GROQ_MODEL, DEFAULT_MODEL);
export const fallbackModel = () => pick(process.env.GROQ_FALLBACK_MODEL, DEFAULT_FALLBACK_MODEL);

let client: Groq | null = null;
export function groq() {
  if (!client) client = new Groq({ apiKey: process.env.GROQ_API_KEY || "missing" });
  return client;
}

/** Strip code fences and anything around the outermost JSON object, then parse. */
export function parseJson<T = Record<string, unknown>>(raw: string): T {
  const cleaned = raw.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  return JSON.parse(start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned) as T;
}

/**
 * Ask for a JSON object. Tries the main model, then the fallback, and logs why
 * each attempt failed (the old code swallowed the error, which hid the outage).
 */
export async function chatJSON<T = Record<string, unknown>>(opts: {
  messages: { role: "system" | "user"; content: string }[];
  maxTokens?: number;
  models?: string[];
}): Promise<T> {
  const models = opts.models ?? [primaryModel(), fallbackModel()];
  let lastError: unknown;
  for (const model of models) {
    try {
      const completion = await groq().chat.completions.create({
        model,
        messages: opts.messages,
        temperature: 0.2,
        // gpt-oss models reason before answering; keep that short so the answer fits.
        reasoning_effort: "low",
        max_completion_tokens: opts.maxTokens ?? 4096,
        response_format: { type: "json_object" },
      });
      const raw = completion.choices[0]?.message?.content ?? "";
      if (!raw.trim()) throw new Error(`Empty response from ${model}`);
      return parseJson<T>(raw);
    } catch (error) {
      lastError = error;
      console.error(`[ai] ${model} failed:`, error instanceof Error ? error.message : error);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("AI request failed");
}
