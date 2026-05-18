// supabase/functions/ai-chat/index.ts
//
// Context-aware chat between user and Claude.
// Auth: requires Authorization: Bearer <jwt> header (Supabase JWT).
//
// Request body:
//   { conversation_id?: string, message: string, baby_id?: string, pregnancy_id?: string }
//
// Response:
//   { conversation_id, reply, risk_level, suggestions }
//
// Smoke test (local):
//   supabase functions serve ai-chat --env-file .env
//   curl -X POST http://localhost:54321/functions/v1/ai-chat \
//     -H "Authorization: Bearer <USER_JWT>" \
//     -H "Content-Type: application/json" \
//     -d '{"message":"Bé nhà mình 3 tháng ngủ mấy tiếng là đủ?"}'

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { CORS_HEADERS, errorResponse, jsonResponse } from '../_shared/cors.ts';
import { buildAuthedClients } from '../_shared/supabase.ts';
import { callClaude, ClaudeError } from '../_shared/anthropic.ts';
import {
  CHAT_SYSTEM_PROMPT,
  ChatMeta,
  extractMeta,
} from '../_shared/prompts.ts';
import {
  classifyRisk,
  ensureDisclaimer,
  fallbackReply,
  RiskLevel,
} from '../_shared/safety.ts';
import {
  formatBabyForPrompt,
  formatMemoryForPrompt,
  formatPregnancyForPrompt,
  formatProfileForPrompt,
  loadBabyContext,
  loadMemory,
  loadPregnancyContext,
  loadProfile,
  loadRecentMessages,
} from '../_shared/context.ts';

interface ChatBody {
  conversation_id?: string | null;
  message: string;
  baby_id?: string | null;
  pregnancy_id?: string | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return errorResponse('Phương thức không được hỗ trợ.', 405);
  }

  try {
    const authed = await buildAuthedClients(req);
    if (!authed) return errorResponse('Thiếu hoặc sai thông tin xác thực.', 401);
    const { userClient, adminClient, userId } = authed;

    const body = (await req.json()) as ChatBody;
    const userMessage = (body.message ?? '').trim();
    if (!userMessage) return errorResponse('Thiếu nội dung tin nhắn.', 400);

    // 1. Resolve or create conversation (RLS verifies ownership on insert/select)
    let conversationId = body.conversation_id ?? null;
    if (conversationId) {
      const { data } = await userClient
        .from('ai_conversations')
        .select('id')
        .eq('id', conversationId)
        .maybeSingle();
      if (!data) return errorResponse('Không tìm thấy cuộc trò chuyện.', 404);
    } else {
      const { data, error } = await userClient
        .from('ai_conversations')
        .insert({
          owner_id: userId,
          baby_id: body.baby_id ?? null,
          pregnancy_id: body.pregnancy_id ?? null,
          title: userMessage.slice(0, 60),
        })
        .select('id')
        .single();
      if (error || !data) {
        console.error('[ai-chat] create conversation failed', error);
        return errorResponse('Không tạo được cuộc trò chuyện.', 500);
      }
      conversationId = data.id as string;
    }

    // 2. Build context bundle (all RLS-scoped through userClient)
    const [profile, babyCtx, pregCtx, memory, history] = await Promise.all([
      loadProfile(userClient, userId),
      body.baby_id ? loadBabyContext(userClient, body.baby_id) : Promise.resolve(null),
      body.pregnancy_id ? loadPregnancyContext(userClient, body.pregnancy_id) : Promise.resolve(null),
      loadMemory(userClient, userId, body.baby_id, body.pregnancy_id),
      loadRecentMessages(userClient, conversationId, 10),
    ]);

    const contextSections = [
      'THÔNG TIN NGƯỜI DÙNG:',
      profile ? formatProfileForPrompt(profile) : '- Không có hồ sơ.',
      babyCtx ? `\nHỒ SƠ EM BÉ:\n${formatBabyForPrompt(babyCtx)}` : '',
      pregCtx ? `\nHỒ SƠ THAI KỲ:\n${formatPregnancyForPrompt(pregCtx)}` : '',
      memory.length ? `\n${formatMemoryForPrompt(memory)}` : '',
    ].filter(Boolean).join('\n');

    const fullSystem = `${CHAT_SYSTEM_PROMPT}\n\n${contextSections}`;

    // 3. Build messages array: history + new user message
    const messages = [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: userMessage },
    ];

    // 4. Call Claude (graceful fallback on failure)
    let assistantBody = '';
    let meta: ChatMeta | null = null;
    let risk: RiskLevel = 'green';
    let suggestions: string[] = [];

    try {
      const claude = await callClaude({
        system: fullSystem,
        messages,
        max_tokens: 1024,
        temperature: 0.4,
      });
      const parsed = extractMeta<ChatMeta>(claude.text);
      assistantBody = parsed.body || claude.text;
      meta = parsed.meta;
      risk = meta?.risk_level ?? classifyRisk(assistantBody);
      suggestions = Array.isArray(meta?.suggestions) ? meta!.suggestions.slice(0, 3) : [];
      if (!['green', 'yellow', 'red'].includes(risk)) risk = 'yellow';
      assistantBody = ensureDisclaimer(assistantBody);
    } catch (err) {
      console.error('[ai-chat] Claude call failed', err instanceof ClaudeError ? err.status : err);
      const fb = fallbackReply();
      assistantBody = fb.reply;
      risk = fb.risk_level;
      suggestions = fb.suggestions;
    }

    // 5. Persist both messages.
    //    Use adminClient (service role) for the assistant row so the server-authored
    //    reply is always saved even if RLS evolves later. Both rows scoped by
    //    conversation_id which we just validated belongs to user.
    await adminClient.from('ai_messages').insert([
      {
        conversation_id: conversationId,
        role: 'user',
        content: userMessage,
        risk_level: 'green',
      },
      {
        conversation_id: conversationId,
        role: 'assistant',
        content: assistantBody,
        risk_level: risk,
      },
    ]);

    await adminClient
      .from('ai_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return jsonResponse({
      conversation_id: conversationId,
      reply: assistantBody,
      risk_level: risk,
      suggestions,
    });
  } catch (err) {
    console.error('[ai-chat] unhandled error', err instanceof Error ? err.message : err);
    return errorResponse('Lỗi xử lý yêu cầu trợ lý.', 500);
  }
});
