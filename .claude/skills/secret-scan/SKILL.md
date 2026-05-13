---
name: secret-scan
description: Scan the FollowYourBaby client bundle for leaked secrets. Use when user says "kiểm tra secret", "scan API key", before a release, or after env config changes. Checks that ANTHROPIC_API_KEY, Supabase service_role keys, and any other server-only secrets are NOT bundled into the client (app/, components/, lib/, stores/, hooks/, types/). Verifies only EXPO_PUBLIC_* prefixed vars are read client-side. Read-only — reports findings.
---

# Skill: secret-scan

Scan for accidentally-bundled secrets in the FollowYourBaby client.

## Forbidden in client code

These must NEVER appear in any file under `app/`, `components/`, `lib/`, `stores/`, `hooks/`, `types/`, `assets/`, `App.tsx`, `index.ts`, or `metro.config.js`:

- `ANTHROPIC_API_KEY` (or its value)
- `SUPABASE_SERVICE_ROLE_KEY` / `service_role` JWT
- `process.env.<NAME>` where `<NAME>` does not start with `EXPO_PUBLIC_`
- Hard-coded API keys (look for shapes: `sk-ant-`, `sk-`, `eyJ` for JWTs longer than 200 chars)
- Database connection strings (`postgres://...`, `postgresql://...`)
- Webhook URLs with embedded secrets
- Private keys (`-----BEGIN`)

Only these env-var patterns are OK in client code:

- `process.env.EXPO_PUBLIC_*`
- `Constants.expoConfig.extra.*` (Expo config)

## Allowed in server / Edge Functions

Under `supabase/functions/`, server-only secrets via `Deno.env.get(...)` are fine. But still flag:

- Hard-coded literal API keys (should be env var).
- Secrets in error messages or `console.log`.
- Secrets ever returned in a response body.

## Other places to check

- `.env*` files committed to git (only `.env.example` should be tracked).
- `app.json` / `app.config.js` — anything under `extra` is bundled into the client; treat like `EXPO_PUBLIC_*`.
- `eas.json` — `env` blocks are baked into builds; secrets here leak into the binary.
- README / docs / CLAUDE.md — placeholder keys should be `<...>` not real values.

## Report format

```
## Secret Scan — <date>

### 🔴 Confirmed leaks
- <file:line> — pattern matched: ANTHROPIC_API_KEY in client bundle
- <file:line> — hard-coded `sk-ant-...` key

### 🟡 Suspicious
- <file:line> — `process.env.X` without EXPO_PUBLIC_ prefix — likely undefined at runtime; verify intent
- <file:line> — JWT-shaped string of length N; verify it's not a service_role

### 🟢 Verified clean
- app/, components/, lib/, stores/, hooks/ — no forbidden patterns
- .env tracked status: <listed git-ignored>

### Recommendations
- ...
```

## How to run

1. Grep for forbidden patterns across `app/`, `components/`, `lib/`, `stores/`, `hooks/`, `types/`:
   - `ANTHROPIC_API_KEY`
   - `service_role`
   - `sk-ant-`
   - `process\.env\.(?!EXPO_PUBLIC_)`
2. Grep `app.json`, `app.config.js`, `eas.json` for embedded secrets in `extra` / `env`.
3. Check `.gitignore` covers `.env`, `.env.production`.
4. Run `git ls-files` (if git repo) to confirm no `.env` is tracked.
5. For any suspected match, read the surrounding context — `ANTHROPIC_API_KEY` in a comment saying "do NOT add this to client" is fine.

## Don't

- Don't print the actual secret value in the report — show shape only (`sk-ant-***`).
- Don't `git log -p` searching for past leaks unless user explicitly asks — that's a separate, heavier audit.
- Don't auto-rotate secrets — only the user can do that. Flag and let them act.
