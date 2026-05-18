// supabase/functions/ai-risk-alert/index.ts
//
// Rule-based proactive risk detection. Claude only rephrases — risk_level is
// strictly determined by rules so it stays deterministic.
//
// Request body:
//   { baby_id?: string, pregnancy_id?: string }
//
// Response:
//   { alerts: [{ message, risk_level, category, action }] }
//
// Rules (deterministic):
//   Baby:
//     - no feed log in last 4h  → yellow
//     - no diaper log in last 8h → yellow
//     - any fever_c >= 39.0 today → red
//     - no growth entry in last 30 days → yellow
//   Pregnancy:
//     - kick session today with count < 10 → yellow
//     - no kick session in last 2 days (after week 28) → yellow
//   Milestone:
//     - any catalog entry with age_max_months < baby age, not achieved → yellow
//
// Smoke test:
//   curl -X POST http://localhost:54321/functions/v1/ai-risk-alert \
//     -H "Authorization: Bearer <USER_JWT>" -H "Content-Type: application/json" \
//     -d '{"baby_id":"<UUID>"}'

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { CORS_HEADERS, errorResponse, jsonResponse } from '../_shared/cors.ts';
import { buildAuthedClients } from '../_shared/supabase.ts';
import { callClaude } from '../_shared/anthropic.ts';
import { extractFirstJson, RISK_ALERT_SYSTEM_PROMPT } from '../_shared/prompts.ts';
import { calcAgeMonths, calcPregnancyWeek } from '../_shared/context.ts';

type Risk = 'yellow' | 'red';

interface Alert {
  category: 'feed' | 'sleep' | 'diaper' | 'kick' | 'growth' | 'symptom' | 'milestone';
  risk_level: Risk;
  message: string;
  action: string;
  rule_id: string;
}

interface AlertResponseItem {
  category: string;
  risk_level: Risk;
  message: string;
  action: string;
}

interface RequestBody {
  baby_id?: string;
  pregnancy_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return errorResponse('Phương thức không được hỗ trợ.', 405);

  try {
    const authed = await buildAuthedClients(req);
    if (!authed) return errorResponse('Thiếu hoặc sai thông tin xác thực.', 401);
    const { userClient } = authed;

    const body = (await req.json()) as RequestBody;
    if (!body.baby_id && !body.pregnancy_id) {
      return errorResponse('Cần baby_id hoặc pregnancy_id.', 400);
    }

    const now = Date.now();
    const alerts: Alert[] = [];

    if (body.baby_id) {
      const { data: baby } = await userClient
        .from('babies')
        .select('id, name, dob')
        .eq('id', body.baby_id)
        .maybeSingle();
      if (!baby) return errorResponse('Không tìm thấy hồ sơ em bé.', 404);

      const ageMonths = calcAgeMonths(baby.dob as string);
      const since4h = new Date(now - 4 * 3600 * 1000).toISOString();
      const since8h = new Date(now - 8 * 3600 * 1000).toISOString();
      const since30d = new Date(now - 30 * 86400 * 1000).toISOString();
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

      const [feed4h, diaper8h, fever, growth30] = await Promise.all([
        userClient.from('feed_logs').select('id', { count: 'exact', head: true }).eq('baby_id', body.baby_id).gte('started_at', since4h),
        userClient.from('diaper_logs').select('id', { count: 'exact', head: true }).eq('baby_id', body.baby_id).gte('recorded_at', since8h),
        userClient.from('symptom_logs').select('fever_c, recorded_at').eq('baby_id', body.baby_id).gte('recorded_at', todayStart.toISOString()).gte('fever_c', 39.0).limit(1),
        userClient.from('growth_logs').select('id', { count: 'exact', head: true }).eq('baby_id', body.baby_id).gte('recorded_at', since30d),
      ]);

      // Only flag "no feed in 4h" for babies < 12 months — older babies are weaning/solids.
      if ((feed4h.count ?? 0) === 0 && ageMonths < 12) {
        alerts.push({
          category: 'feed',
          risk_level: 'yellow',
          rule_id: 'no_feed_4h',
          message: `Bé ${baby.name} chưa có ghi nhận cữ bú/ăn trong 4 giờ qua.`,
          action: 'Kiểm tra xem bé có đói không, ghi lại cữ ăn gần nhất.',
        });
      }

      if ((diaper8h.count ?? 0) === 0) {
        alerts.push({
          category: 'diaper',
          risk_level: 'yellow',
          rule_id: 'no_diaper_8h',
          message: `Bé ${baby.name} chưa có ghi nhận tã trong 8 giờ qua.`,
          action: 'Kiểm tra tã và lượng nước tiểu để theo dõi đủ nước.',
        });
      }

      if ((fever.data ?? []).length > 0) {
        alerts.push({
          category: 'symptom',
          risk_level: 'red',
          rule_id: 'fever_high',
          message: `Bé ${baby.name} đang có biểu hiện sốt cao (≥39°C).`,
          action: 'Cần đưa bé đến cơ sở y tế gần nhất ngay.',
        });
      }

      if ((growth30.count ?? 0) === 0 && ageMonths >= 1) {
        alerts.push({
          category: 'growth',
          risk_level: 'yellow',
          rule_id: 'no_growth_30d',
          message: `Bé ${baby.name} chưa được cân/đo trong 30 ngày qua.`,
          action: 'Cân và đo lại để theo dõi đường tăng trưởng.',
        });
      }

      // Overdue milestone check
      const [achieved, catalog] = await Promise.all([
        userClient.from('milestones').select('key').eq('baby_id', body.baby_id).not('achieved_at', 'is', null),
        userClient.from('milestone_catalog').select('key, title_vi, age_max_months').lt('age_max_months', ageMonths).limit(50),
      ]);
      const achievedSet = new Set((achieved.data ?? []).map((m: { key: string }) => m.key));
      const overdue = ((catalog.data ?? []) as Array<{ key: string; title_vi: string; age_max_months: number }>)
        .filter((c) => !achievedSet.has(c.key))
        .slice(0, 3);
      for (const m of overdue) {
        alerts.push({
          category: 'milestone',
          risk_level: 'yellow',
          rule_id: `milestone_overdue:${m.key}`,
          message: `Mốc "${m.title_vi}" thường đạt trước ${m.age_max_months} tháng, bé chưa được ghi nhận.`,
          action: 'Quan sát thêm và trao đổi với bác sĩ ở lần khám tới.',
        });
      }
    }

    if (body.pregnancy_id) {
      const { data: pg } = await userClient
        .from('pregnancies')
        .select('id, lmp_date, due_date')
        .eq('id', body.pregnancy_id)
        .maybeSingle();
      if (!pg) return errorResponse('Không tìm thấy hồ sơ thai kỳ.', 404);

      const week = calcPregnancyWeek(pg.lmp_date as string | null, pg.due_date as string | null);
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const since2d = new Date(now - 2 * 86400 * 1000).toISOString();

      const [todayKicks, recentKicks] = await Promise.all([
        userClient.from('kick_counts').select('count').eq('pregnancy_id', body.pregnancy_id).gte('started_at', todayStart.toISOString()),
        userClient.from('kick_counts').select('id', { count: 'exact', head: true }).eq('pregnancy_id', body.pregnancy_id).gte('started_at', since2d),
      ]);

      const todayList = (todayKicks.data ?? []) as Array<{ count: number }>;
      if (todayList.length > 0) {
        const total = todayList.reduce((s, k) => s + (k.count ?? 0), 0);
        if (total < 10) {
          alerts.push({
            category: 'kick',
            risk_level: 'yellow',
            rule_id: 'kick_low_today',
            message: `Hôm nay thai máy chỉ ghi nhận ${total} lần, dưới ngưỡng khuyến nghị.`,
            action: 'Nghỉ ngơi, uống nước và đếm lại sau 1 giờ; nếu vẫn dưới 10 lần/giờ, hãy đến bệnh viện.',
          });
        }
      }

      if (week !== null && week >= 28 && (recentKicks.count ?? 0) === 0) {
        alerts.push({
          category: 'kick',
          risk_level: 'yellow',
          rule_id: 'no_kick_2d',
          message: 'Chưa có phiên đếm thai máy nào trong 2 ngày qua.',
          action: 'Hãy đếm thai máy hôm nay; báo bác sĩ nếu thấy giảm rõ rệt.',
        });
      }
    }

    if (alerts.length === 0) {
      return jsonResponse({ alerts: [] });
    }

    // Phrase via Claude — but never let Claude change risk_level / category / rule_id.
    let finalAlerts: AlertResponseItem[] = alerts.map((a) => ({
      category: a.category,
      risk_level: a.risk_level,
      message: a.message,
      action: a.action,
    }));

    try {
      const userPrompt = `Danh sách cảnh báo (giữ nguyên risk_level và category):\n${JSON.stringify(alerts, null, 2)}\n\nHãy viết lại "message" và "action" cho ấm áp và rõ ràng hơn (tiếng Việt, không hù dọa).`;
      const claude = await callClaude({
        system: RISK_ALERT_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
        max_tokens: 1024,
        temperature: 0.3,
      });
      const parsed = extractFirstJson<{ alerts?: Array<{ category?: string; risk_level?: string; message?: string; action?: string }> }>(claude.text);
      if (parsed?.alerts && Array.isArray(parsed.alerts)) {
        // Map by rule_id order — Claude returns same order, so zip.
        finalAlerts = alerts.map((a, idx) => {
          const c = parsed.alerts![idx];
          return {
            category: a.category, // never trust Claude
            risk_level: a.risk_level, // never trust Claude
            message: typeof c?.message === 'string' && c.message.trim() ? c.message.trim() : a.message,
            action: typeof c?.action === 'string' && c.action.trim() ? c.action.trim() : a.action,
          };
        });
      }
    } catch (err) {
      console.error('[ai-risk-alert] Claude rephrase failed, using raw alerts', err instanceof Error ? err.message : err);
      // Keep deterministic fallback alerts.
    }

    // Sort red before yellow
    finalAlerts.sort((a, b) => (a.risk_level === b.risk_level ? 0 : a.risk_level === 'red' ? -1 : 1));

    return jsonResponse({ alerts: finalAlerts });
  } catch (err) {
    console.error('[ai-risk-alert] unhandled error', err instanceof Error ? err.message : err);
    return errorResponse('Lỗi xử lý cảnh báo.', 500);
  }
});
