---
name: new-edge-function
description: Scaffold a new Supabase Edge Function for FollowYourBaby. Use when the user asks to add a new Edge Function, "tạo edge function", or implement server-side logic that touches Anthropic Claude, OCR, push notifications, or any work requiring secret keys. Sets up the function under supabase/functions/<kebab-case>/ with proper CORS, auth check, env validation, error handling, and (for AI functions) risk_level fallback.
---

# Skill: new-edge-function

Scaffold a Supabase Edge Function following FollowYourBaby conventions.

## Pre-flight

1. Get function name from user — must be `kebab-case` (e.g. `ai-chat`, `ai-summary`, `push-notify`, `ocr-visit`).
2. Confirm whether the function:
   - **calls Claude** → must use `ANTHROPIC_API_KEY` (server-only) + return `risk_level`
   - **modifies DB** → must verify caller's `auth.uid()` and respect share-care permissions
   - **sends push** → uses Expo push API + reads device tokens from DB
   - **OCR/file** → reads from Supabase Storage with signed URLs only

## File structure

```
supabase/functions/<name>/
├── index.ts          # Entry point — Deno
└── deno.json         # (optional) Deno config
```

## Mandatory rules

- **All secrets via `Deno.env.get(...)`** — never hard-code, never `console.log` the secret.
- **Validate auth on every call**: get the user from `supabase.auth.getUser(jwt)` — refuse if null.
- **CORS**: always handle the `OPTIONS` preflight and set headers; the mobile app calls cross-origin in dev.
- **Timeout**: wrap external calls (Anthropic, OCR, Expo push) in `AbortController` with 25s timeout (Edge Functions hard-cap at 60s on Supabase free tier).
- **Errors return JSON, not throw**: `{ error: string, code: string }` with proper HTTP status. The mobile app needs structured errors for fallback UI.
- **No PII in logs**: don't `console.log` request bodies that may contain baby/mom names, weights, or symptoms. Log shapes/counts only.

## index.ts template

```ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RequestBody {
  // define inputs
}

interface ResponseBody {
  // define outputs — for AI functions include risk_level
  risk_level?: "green" | "yellow" | "red";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return jsonError("unauthorized", 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return jsonError("unauthorized", 401);

    // 2. Parse + validate body
    const body = (await req.json()) as RequestBody;
    // validate fields...

    // 3. Business logic (Claude call, DB query, etc.) with AbortController
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    try {
      // const result = await callClaude(body, controller.signal);
    } finally {
      clearTimeout(timeout);
    }

    // 4. Respond
    const response: ResponseBody = {
      // ...
      risk_level: "green", // ONLY if this is an AI function
    };
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("function error", { name: (e as Error).name }); // no payload
    return jsonError("internal_error", 500);
  }
});

function jsonError(code: string, status: number) {
  return new Response(JSON.stringify({ error: code, code }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
```

## AI function extras (`ai-*` functions)

- Always return `risk_level: "green" | "yellow" | "red"`.
- On Claude error/timeout, return a **green fallback** with a static safe response — never leave the app without a response.
- Append `disclaimer: "Thông tin từ AI, không thay thế bác sĩ"` to every AI response.
- Use system prompts that explicitly instruct Claude to flag medical red flags and refuse to diagnose.

## After scaffolding

1. Deploy locally: `supabase functions serve <name> --env-file .env.local`.
2. Test with curl or from the app — verify auth rejection works.
3. When ready: `supabase functions deploy <name>`.
4. Add the function to the project root README/CLAUDE.md function map if it's new.

## Don't

- Don't accept user-supplied `user_id` in the body — always derive from JWT.
- Don't put the Claude API key in any response, log, or error message.
- Don't skip the OPTIONS handler — mobile fetch will fail silently in dev.
