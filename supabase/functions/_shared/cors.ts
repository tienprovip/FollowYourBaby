// Shared CORS headers for all Edge Functions.
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const JSON_HEADERS = {
  ...CORS_HEADERS,
  'Content-Type': 'application/json',
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export function errorResponse(message: string, status = 500): Response {
  return new Response(
    JSON.stringify({ error: message, risk_level: 'green' }),
    { status, headers: JSON_HEADERS },
  );
}
