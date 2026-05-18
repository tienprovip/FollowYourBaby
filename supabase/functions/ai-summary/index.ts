// supabase/functions/ai-summary/index.ts
//
// Daily / weekly / monthly digest of tracking data, summarized by Claude in Vietnamese.
//
// Request body:
//   { period: 'daily' | 'weekly' | 'monthly', baby_id?: string, pregnancy_id?: string, date?: string }
//
// Response:
//   { summary: markdown, highlights: string[], risk_level, action_items: string[] }
//
// Smoke test:
//   curl -X POST http://localhost:54321/functions/v1/ai-summary \
//     -H "Authorization: Bearer <USER_JWT>" \
//     -H "Content-Type: application/json" \
//     -d '{"period":"daily","baby_id":"<BABY_UUID>"}'

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { CORS_HEADERS, errorResponse, jsonResponse } from '../_shared/cors.ts';
import { buildAuthedClients } from '../_shared/supabase.ts';
import { callClaude, ClaudeError } from '../_shared/anthropic.ts';
import {
  extractMeta,
  SUMMARY_SYSTEM_PROMPT,
  SummaryMeta,
} from '../_shared/prompts.ts';
import {
  classifyRisk,
  ensureDisclaimer,
  RiskLevel,
} from '../_shared/safety.ts';
import {
  formatBabyForPrompt,
  formatPregnancyForPrompt,
  formatProfileForPrompt,
  loadBabyContext,
  loadPregnancyContext,
  loadProfile,
} from '../_shared/context.ts';

interface SummaryBody {
  period: 'daily' | 'weekly' | 'monthly';
  baby_id?: string;
  pregnancy_id?: string;
  date?: string;
}

function periodSinceIso(period: SummaryBody['period'], anchor: Date): string {
  const d = new Date(anchor);
  if (period === 'daily') d.setHours(0, 0, 0, 0);
  else if (period === 'weekly') d.setDate(d.getDate() - 7);
  else d.setDate(d.getDate() - 30);
  return d.toISOString();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return errorResponse('Phương thức không được hỗ trợ.', 405);

  try {
    const authed = await buildAuthedClients(req);
    if (!authed) return errorResponse('Thiếu hoặc sai thông tin xác thực.', 401);
    const { userClient, userId } = authed;

    const body = (await req.json()) as SummaryBody;
    if (!body.period || !['daily', 'weekly', 'monthly'].includes(body.period)) {
      return errorResponse('Tham số period không hợp lệ.', 400);
    }
    if (!body.baby_id && !body.pregnancy_id) {
      return errorResponse('Cần cung cấp baby_id hoặc pregnancy_id.', 400);
    }

    const anchor = body.date ? new Date(body.date) : new Date();
    const since = periodSinceIso(body.period, anchor);

    // Aggregate period-specific raw stats (RLS-scoped via userClient).
    const aggregates: string[] = [];

    if (body.baby_id) {
      // Verify ownership via RLS — return 404 if not visible.
      const { data: baby } = await userClient
        .from('babies')
        .select('id')
        .eq('id', body.baby_id)
        .maybeSingle();
      if (!baby) return errorResponse('Không tìm thấy hồ sơ em bé.', 404);

      const [feeds, sleeps, diapers, symptoms, growth] = await Promise.all([
        userClient.from('feed_logs').select('amount_ml, started_at, type').eq('baby_id', body.baby_id).gte('started_at', since),
        userClient.from('sleep_logs').select('started_at, ended_at, kind').eq('baby_id', body.baby_id).gte('started_at', since),
        userClient.from('diaper_logs').select('kind, recorded_at').eq('baby_id', body.baby_id).gte('recorded_at', since),
        userClient.from('symptom_logs').select('symptom_key, severity, fever_c, recorded_at').eq('baby_id', body.baby_id).gte('recorded_at', since),
        userClient.from('growth_logs').select('recorded_at, weight_g, length_cm').eq('baby_id', body.baby_id).gte('recorded_at', since).order('recorded_at', { ascending: false }).limit(2),
      ]);

      const totalMl = (feeds.data ?? []).reduce((s: number, f: { amount_ml: number | null }) => s + (f.amount_ml ?? 0), 0);
      const sleepHrs = (sleeps.data ?? []).reduce((s: number, l: { started_at: string; ended_at: string | null }) => {
        if (!l.ended_at) return s;
        return s + (new Date(l.ended_at).getTime() - new Date(l.started_at).getTime()) / 3600000;
      }, 0);
      const wet = (diapers.data ?? []).filter((d: { kind: string }) => d.kind === 'wet' || d.kind === 'both').length;
      const dirty = (diapers.data ?? []).filter((d: { kind: string }) => d.kind === 'dirty' || d.kind === 'both').length;
      const highFever = (symptoms.data ?? []).filter((s: { fever_c: number | null }) => (s.fever_c ?? 0) >= 38.5).length;

      aggregates.push(
        `THỐNG KÊ EM BÉ (${body.period}, từ ${since.slice(0, 10)}):`,
        `- Số cữ bú/ăn: ${(feeds.data ?? []).length}, tổng ~${Math.round(totalMl)} ml.`,
        `- Tổng giấc ngủ: ~${sleepHrs.toFixed(1)} giờ.`,
        `- Tã ướt: ${wet}, tã bẩn: ${dirty}.`,
        `- Triệu chứng ghi nhận: ${(symptoms.data ?? []).length}${highFever ? ` (trong đó ${highFever} lần sốt ≥38.5°C)` : ''}.`,
        growth.data && growth.data.length
          ? `- Cân nặng mới nhất: ${growth.data[0].weight_g ?? '?'} g, dài ${growth.data[0].length_cm ?? '?'} cm.`
          : '- Chưa có ghi nhận cân nặng trong giai đoạn.',
      );
    }

    if (body.pregnancy_id) {
      const { data: pg } = await userClient
        .from('pregnancies')
        .select('id')
        .eq('id', body.pregnancy_id)
        .maybeSingle();
      if (!pg) return errorResponse('Không tìm thấy hồ sơ thai kỳ.', 404);

      const [weights, kicks, syms, visits] = await Promise.all([
        userClient.from('pregnancy_weights').select('recorded_at, weight_kg').eq('pregnancy_id', body.pregnancy_id).gte('recorded_at', since).order('recorded_at', { ascending: true }),
        userClient.from('kick_counts').select('started_at, count').eq('pregnancy_id', body.pregnancy_id).gte('started_at', since),
        userClient.from('pregnancy_symptoms').select('symptom_key, severity, recorded_at').eq('pregnancy_id', body.pregnancy_id).gte('recorded_at', since),
        userClient.from('prenatal_visits').select('scheduled_at, type').eq('pregnancy_id', body.pregnancy_id).gte('scheduled_at', new Date().toISOString()).order('scheduled_at', { ascending: true }).limit(2),
      ]);

      const wList = (weights.data ?? []) as Array<{ weight_kg: number }>;
      const weightChange = wList.length >= 2 ? (wList[wList.length - 1].weight_kg - wList[0].weight_kg) : 0;
      const totalKicks = (kicks.data ?? []).reduce((s: number, k: { count: number }) => s + (k.count ?? 0), 0);

      aggregates.push(
        `THỐNG KÊ THAI KỲ (${body.period}, từ ${since.slice(0, 10)}):`,
        `- Ghi nhận cân nặng: ${wList.length} lần${wList.length >= 2 ? ` (thay đổi ${weightChange >= 0 ? '+' : ''}${weightChange.toFixed(1)} kg)` : ''}.`,
        `- Phiên đếm thai máy: ${(kicks.data ?? []).length}, tổng ~${totalKicks} lần.`,
        `- Triệu chứng ghi nhận: ${(syms.data ?? []).length}.`,
        (visits.data ?? []).length ? `- Lịch khám sắp tới: ${(visits.data ?? []).length} buổi.` : '- Chưa có lịch khám sắp tới.',
      );
    }

    // Load context for the prompt (latest snapshot, not period-bound).
    const [profile, babyCtx, pregCtx] = await Promise.all([
      loadProfile(userClient, userId),
      body.baby_id ? loadBabyContext(userClient, body.baby_id) : Promise.resolve(null),
      body.pregnancy_id ? loadPregnancyContext(userClient, body.pregnancy_id) : Promise.resolve(null),
    ]);

    const contextSections = [
      profile ? `NGƯỜI DÙNG:\n${formatProfileForPrompt(profile)}` : '',
      babyCtx ? `\nHỒ SƠ EM BÉ:\n${formatBabyForPrompt(babyCtx)}` : '',
      pregCtx ? `\nHỒ SƠ THAI KỲ:\n${formatPregnancyForPrompt(pregCtx)}` : '',
      `\n${aggregates.join('\n')}`,
    ].filter(Boolean).join('\n');

    const periodVi = body.period === 'daily' ? 'hôm nay' : body.period === 'weekly' ? '7 ngày qua' : '30 ngày qua';
    const userPrompt = `Hãy tạo bản tóm tắt ${periodVi} dựa trên dữ liệu sau:\n\n${contextSections}`;

    let summary = '';
    let highlights: string[] = [];
    let action_items: string[] = [];
    let risk: RiskLevel = 'green';

    try {
      const claude = await callClaude({
        system: SUMMARY_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
        max_tokens: 1024,
        temperature: 0.5,
      });
      const parsed = extractMeta<SummaryMeta>(claude.text);
      summary = parsed.body || claude.text;
      highlights = Array.isArray(parsed.meta?.highlights) ? parsed.meta!.highlights.slice(0, 4) : [];
      action_items = Array.isArray(parsed.meta?.action_items) ? parsed.meta!.action_items.slice(0, 3) : [];
      risk = parsed.meta?.risk_level ?? classifyRisk(summary);
      if (!['green', 'yellow', 'red'].includes(risk)) risk = 'yellow';
      summary = ensureDisclaimer(summary);
    } catch (err) {
      console.error('[ai-summary] Claude call failed', err instanceof ClaudeError ? err.status : err);
      summary = `Hiện chưa thể tạo bản tóm tắt tự động. Bạn có thể xem lại các con số ở phần thống kê ${periodVi}.`;
      highlights = [];
      action_items = [];
      risk = 'green';
      summary = ensureDisclaimer(summary);
    }

    return jsonResponse({ summary, highlights, risk_level: risk, action_items });
  } catch (err) {
    console.error('[ai-summary] unhandled error', err instanceof Error ? err.message : err);
    return errorResponse('Lỗi xử lý yêu cầu tóm tắt.', 500);
  }
});
