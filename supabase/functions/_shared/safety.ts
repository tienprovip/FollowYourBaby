// Risk classification + safety helpers for AI output.
// risk_level is REQUIRED on every assistant response.

export type RiskLevel = 'green' | 'yellow' | 'red';

// Red-flag keywords (Vietnamese, lowercased). Presence → red.
const RED_KEYWORDS = [
  'khẩn cấp',
  'cấp cứu',
  'nguy hiểm',
  'ngừng thở',
  'co giật',
  'ra máu nhiều',
  'không cử động',
  'tím tái',
  'vỡ ối',
  'sốt cao trên 39',
  'sốt trên 39',
  'mất ý thức',
  'đau bụng dữ dội',
  'chảy máu nhiều',
];

// Yellow keywords (lowercased). Presence (and no red) → yellow.
const YELLOW_KEYWORDS = [
  'nên gặp bác sĩ',
  'nên đi khám',
  'theo dõi thêm',
  'sốt cao',
  'giảm bú',
  'bú ít',
  'thai máy giảm',
  'bất thường',
  'lưu ý',
  'cẩn trọng',
];

export function classifyRisk(text: string): RiskLevel {
  const lower = text.toLowerCase();
  for (const kw of RED_KEYWORDS) {
    if (lower.includes(kw)) return 'red';
  }
  for (const kw of YELLOW_KEYWORDS) {
    if (lower.includes(kw)) return 'yellow';
  }
  return 'green';
}

// Disclaimer that MUST be appended (or be present) on every AI output.
export const AI_DISCLAIMER_VI =
  'Lưu ý: thông tin trên không thay thế tư vấn bác sĩ. Nếu lo lắng, hãy liên hệ cơ sở y tế.';

export function ensureDisclaimer(text: string): string {
  if (text.toLowerCase().includes('không thay thế') || text.toLowerCase().includes('thay thế bác sĩ')) {
    return text;
  }
  return `${text.trim()}\n\n${AI_DISCLAIMER_VI}`;
}

// Fallback reply when Claude call fails / times out.
export function fallbackReply(): { reply: string; risk_level: RiskLevel; suggestions: string[] } {
  return {
    reply:
      'Xin lỗi, trợ lý đang gặp sự cố tạm thời. Bạn vui lòng thử lại sau ít phút nhé. Nếu có dấu hiệu cấp cứu, hãy liên hệ ngay cơ sở y tế.',
    risk_level: 'green',
    suggestions: [
      'Thử lại câu hỏi sau ít phút',
      'Xem hướng dẫn theo tuần',
      'Liên hệ bác sĩ nếu khẩn cấp',
    ],
  };
}

// Strip personally identifiable bits before console logging.
export function redactForLog(input: unknown): unknown {
  if (typeof input === 'string') {
    return input
      .replace(/sk-ant-[A-Za-z0-9_-]+/g, '[REDACTED_KEY]')
      .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[REDACTED_EMAIL]');
  }
  return input;
}
