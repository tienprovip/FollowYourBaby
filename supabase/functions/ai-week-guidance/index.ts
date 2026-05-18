// supabase/functions/ai-week-guidance/index.ts
//
// Generate weekly pregnancy content (development, body changes, tips, warnings).
//
// Request body:
//   { pregnancy_id: string, week: number }  // week 1..42
//
// Response:
//   { week, fetal_development, body_changes, tips[], warning_signs[], risk_level: 'green' }
//
// Smoke test:
//   curl -X POST http://localhost:54321/functions/v1/ai-week-guidance \
//     -H "Authorization: Bearer <USER_JWT>" -H "Content-Type: application/json" \
//     -d '{"pregnancy_id":"<UUID>","week":24}'

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { CORS_HEADERS, errorResponse, jsonResponse } from '../_shared/cors.ts';
import { buildAuthedClients } from '../_shared/supabase.ts';
import { callClaude } from '../_shared/anthropic.ts';
import { extractFirstJson, WEEK_GUIDANCE_SYSTEM_PROMPT } from '../_shared/prompts.ts';
import { ensureDisclaimer } from '../_shared/safety.ts';

interface WeekBody {
  pregnancy_id: string;
  week: number;
}

interface WeekContent {
  fetal_development: string;
  body_changes: string;
  tips: string[];
  warning_signs: string[];
}

function fallback(week: number): WeekContent {
  return {
    fetal_development: `Thai nhi tuần ${week} đang tiếp tục phát triển. Hệ thống đang tạm thời không tạo nội dung chi tiết, bạn vui lòng thử lại sau.`,
    body_changes: 'Cơ thể mẹ có thể có nhiều thay đổi trong giai đoạn này. Hãy lắng nghe cơ thể và nghỉ ngơi đủ.',
    tips: ['Uống đủ nước mỗi ngày.', 'Ăn đa dạng nhóm chất.', 'Vận động nhẹ nhàng theo sức khỏe.'],
    warning_signs: ['Chảy máu âm đạo.', 'Đau bụng dữ dội.', 'Thai máy giảm rõ rệt.'],
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return errorResponse('Phương thức không được hỗ trợ.', 405);

  try {
    const authed = await buildAuthedClients(req);
    if (!authed) return errorResponse('Thiếu hoặc sai thông tin xác thực.', 401);
    const { userClient } = authed;

    const body = (await req.json()) as WeekBody;
    if (!body.pregnancy_id || typeof body.week !== 'number') {
      return errorResponse('Cần pregnancy_id và week.', 400);
    }
    if (body.week < 1 || body.week > 42) {
      return errorResponse('Tuần thai phải từ 1 đến 42.', 400);
    }

    // Verify ownership through RLS
    const { data: pg } = await userClient
      .from('pregnancies')
      .select('id')
      .eq('id', body.pregnancy_id)
      .maybeSingle();
    if (!pg) return errorResponse('Không tìm thấy hồ sơ thai kỳ.', 404);

    const userPrompt = `Hãy tạo nội dung cho tuần ${body.week} của thai kỳ. Trả về JSON theo schema đã nêu.`;

    let content: WeekContent;
    try {
      const claude = await callClaude({
        system: WEEK_GUIDANCE_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
        max_tokens: 1024,
        temperature: 0.3,
      });
      const parsed = extractFirstJson<Partial<WeekContent>>(claude.text);
      if (parsed && typeof parsed.fetal_development === 'string') {
        content = {
          fetal_development: parsed.fetal_development,
          body_changes: typeof parsed.body_changes === 'string' ? parsed.body_changes : '',
          tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 5) : [],
          warning_signs: Array.isArray(parsed.warning_signs) ? parsed.warning_signs.slice(0, 5) : [],
        };
      } else {
        content = fallback(body.week);
      }
    } catch (err) {
      console.error('[ai-week-guidance] Claude failed', err instanceof Error ? err.message : err);
      content = fallback(body.week);
    }

    return jsonResponse({
      week: body.week,
      fetal_development: ensureDisclaimer(content.fetal_development),
      body_changes: content.body_changes,
      tips: content.tips,
      warning_signs: content.warning_signs,
      risk_level: 'green',
    });
  } catch (err) {
    console.error('[ai-week-guidance] unhandled error', err instanceof Error ? err.message : err);
    return errorResponse('Lỗi xử lý nội dung tuần.', 500);
  }
});
