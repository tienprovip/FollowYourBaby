// Typed wrapper around the Anthropic Messages API.
// - Uses fetch directly (no SDK) for Deno compatibility.
// - 25s timeout via AbortSignal.
// - Retry 3x with exponential backoff for 5xx and network errors.
// - NEVER logs the API key.

import { redactForLog } from './safety.ts';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-sonnet-4-6';

export interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string | Array<TextBlock | ImageBlock>;
}

export interface TextBlock {
  type: 'text';
  text: string;
}

export interface ImageBlock {
  type: 'image';
  source: {
    type: 'base64';
    media_type: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
    data: string;
  };
}

export interface CallClaudeOptions {
  system: string;
  messages: AnthropicMessage[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

export interface ClaudeReply {
  text: string;
  stop_reason: string | null;
  raw: unknown;
}

export class ClaudeError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function callClaude(opts: CallClaudeOptions): Promise<ClaudeReply> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) throw new ClaudeError('ANTHROPIC_API_KEY chưa được cấu hình.', 500);

  const body = {
    model: opts.model ?? DEFAULT_MODEL,
    max_tokens: opts.max_tokens ?? 1024,
    temperature: opts.temperature ?? 0.4,
    system: opts.system,
    messages: opts.messages,
  };

  let lastError: unknown = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(25000),
      });

      if (res.status >= 500) {
        // retryable
        lastError = new ClaudeError(`Claude server error ${res.status}`, res.status);
      } else if (!res.ok) {
        const errText = await res.text();
        // Non-retryable client error — surface without key in log.
        console.error('[anthropic] client error', res.status, redactForLog(errText));
        throw new ClaudeError(`Claude request failed: ${res.status}`, res.status);
      } else {
        const json = await res.json();
        const text = extractText(json);
        return { text, stop_reason: json.stop_reason ?? null, raw: json };
      }
    } catch (err) {
      if (err instanceof ClaudeError && err.status < 500) throw err;
      lastError = err;
    }
    // Exponential backoff: 500ms, 1.5s, 3.5s
    await new Promise((r) => setTimeout(r, 500 * Math.pow(3, attempt)));
  }

  console.error('[anthropic] exhausted retries', redactForLog(String(lastError)));
  throw new ClaudeError('Không gọi được Claude sau 3 lần thử.', 503);
}

function extractText(payload: unknown): string {
  // Anthropic response shape: { content: [{ type: 'text', text: '...' }, ...] }
  const obj = payload as { content?: Array<{ type: string; text?: string }> };
  if (!obj?.content) return '';
  return obj.content
    .filter((c) => c.type === 'text' && typeof c.text === 'string')
    .map((c) => c.text as string)
    .join('\n')
    .trim();
}
