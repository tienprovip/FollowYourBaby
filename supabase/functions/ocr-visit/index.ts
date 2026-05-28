// supabase/functions/ocr-visit/index.ts
//
// Extract structured fields from prenatal visit document photos using Claude vision.
// Result is returned to client for user confirmation — NEVER auto-saved.
//
// Request body:
//   { image_base64: string, pregnancy_id: string, media_type?: 'image/jpeg'|'image/png'|'image/webp' }
//
// Response:
//   { extracted: {...}, confidence: 'high'|'medium'|'low', risk_level: 'green' }
//
// Smoke test:
//   curl -X POST http://localhost:54321/functions/v1/ocr-visit \
//     -H "Authorization: Bearer <USER_JWT>" -H "Content-Type: application/json" \
//     -d '{"pregnancy_id":"<UUID>","image_base64":"<BASE64>","media_type":"image/jpeg"}'

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { CORS_HEADERS, errorResponse, jsonResponse } from '../_shared/cors.ts';
import { buildAuthedClients } from '../_shared/supabase.ts';
import { callClaude, ImageBlock, TextBlock } from '../_shared/anthropic.ts';
import { extractFirstJson, OCR_SYSTEM_PROMPT } from '../_shared/prompts.ts';

interface OcrBody {
  image_base64: string;
  pregnancy_id: string;
  media_type?: 'image/jpeg' | 'image/png' | 'image/webp';
}

interface Extracted {
  visit_date: string | null;
  facility_name: string | null;
  doctor_name: string | null;
  weight_kg: number | null;
  blood_pressure: string | null;
  fetal_heartbeat: number | null;
  notes: string | null;
  next_visit_date: string | null;
  confidence: 'high' | 'medium' | 'low';
}

function emptyExtracted(): Extracted {
  return {
    visit_date: null,
    facility_name: null,
    doctor_name: null,
    weight_kg: null,
    blood_pressure: null,
    fetal_heartbeat: null,
    notes: null,
    next_visit_date: null,
    confidence: 'low',
  };
}

const MAX_BASE64_LEN = 6 * 1024 * 1024; // ~4.5 MB image

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return errorResponse('Phương thức không được hỗ trợ.', 405);

  try {
    const authed = await buildAuthedClients(req);
    if (!authed) return errorResponse('Thiếu hoặc sai thông tin xác thực.', 401);
    const { userClient } = authed;

    const body = (await req.json()) as OcrBody;
    if (!body.image_base64 || !body.pregnancy_id) {
      return errorResponse('Cần image_base64 và pregnancy_id.', 400);
    }
    if (body.image_base64.length > MAX_BASE64_LEN) {
      return errorResponse('Ảnh quá lớn. Vui lòng giảm kích thước.', 413);
    }

    // Verify ownership via RLS
    const { data: pg } = await userClient
      .from('pregnancies')
      .select('id')
      .eq('id', body.pregnancy_id)
      .maybeSingle();
    if (!pg) return errorResponse('Không tìm thấy hồ sơ thai kỳ.', 404);

    const mediaType = body.media_type ?? 'image/jpeg';

    const imageBlock: ImageBlock = {
      type: 'image',
      source: {
        type: 'base64',
        media_type: mediaType,
        data: body.image_base64,
      },
    };
    const textBlock: TextBlock = {
      type: 'text',
      text: 'Trích xuất thông tin từ phiếu khám thai/siêu âm này. Trả về JSON đúng schema, không thêm chữ ngoài JSON.',
    };

    let extracted: Extracted;
    try {
      const claude = await callClaude({
        system: OCR_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: [imageBlock, textBlock] }],
        max_tokens: 512,
        temperature: 0.1,
      });
      const parsed = extractFirstJson<Partial<Extracted>>(claude.text);
      if (!parsed) {
        extracted = emptyExtracted();
      } else {
        extracted = {
          visit_date: typeof parsed.visit_date === 'string' ? parsed.visit_date : null,
          facility_name: typeof parsed.facility_name === 'string' ? parsed.facility_name : null,
          doctor_name: typeof parsed.doctor_name === 'string' ? parsed.doctor_name : null,
          weight_kg: typeof parsed.weight_kg === 'number' ? parsed.weight_kg : null,
          blood_pressure: typeof parsed.blood_pressure === 'string' ? parsed.blood_pressure : null,
          fetal_heartbeat: typeof parsed.fetal_heartbeat === 'number' ? parsed.fetal_heartbeat : null,
          notes: typeof parsed.notes === 'string' ? parsed.notes : null,
          next_visit_date: typeof parsed.next_visit_date === 'string' ? parsed.next_visit_date : null,
          confidence: parsed.confidence === 'high' || parsed.confidence === 'medium' ? parsed.confidence : 'low',
        };
      }
    } catch (err) {
      console.error('[ocr-visit] Claude vision failed', err instanceof Error ? err.message : err);
      extracted = emptyExtracted();
    }

    const { confidence, ...fields } = extracted;
    return jsonResponse({
      extracted: fields,
      confidence,
      risk_level: 'green',
    });
  } catch (err) {
    console.error('[ocr-visit] unhandled error', err instanceof Error ? err.message : err);
    return errorResponse('Lỗi xử lý OCR.', 500);
  }
});
