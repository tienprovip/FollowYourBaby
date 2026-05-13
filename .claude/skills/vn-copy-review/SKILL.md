---
name: vn-copy-review
description: Review Vietnamese UI copy across FollowYourBaby — screen strings, button labels, empty states, error messages, push notification templates, AI disclaimers, onboarding microcopy. Use when user says "review tiếng Việt", "kiểm tra copy", "tone tiếng Việt có ổn không", before a release, or after adding many new screens. Checks tone (warm + reassuring for mẹ bầu/phụ huynh), avoids cold medical jargon, ensures consistent terminology, and flags translation-y English-shaped phrasing. Read-only — outputs findings.
---

# Skill: vn-copy-review

Review Vietnamese strings in FollowYourBaby for tone, consistency, and accuracy.

## Tone targets

The audience is **Vietnamese mothers (mẹ bầu) and parents (phụ huynh)** who use the app daily — often late at night, exhausted, anxious. Copy should be:

- **Ấm áp, gần gũi** — not clinical. Prefer "Hôm nay bé yêu thế nào?" over "Nhập dữ liệu theo dõi".
- **Ngắn gọn** — mobile screens, one-handed use. Cut filler ("vui lòng", "xin hãy" unless really needed).
- **Khích lệ** — empty states and error states should never make the user feel bad. "Chưa có dữ liệu, mình cùng bắt đầu nhé!" > "Không có dữ liệu".
- **Chính xác về y tế** — no diagnoses, no "chắc chắn", always "có thể" / "nên hỏi bác sĩ".

## What to check

### 1. Consistent terminology

These terms should be used consistently — flag inconsistencies:

| Concept | Use | Avoid |
|---|---|---|
| Người dùng nữ mang thai | mẹ bầu | thai phụ (quá y tế), bà bầu (suồng sã) |
| Em bé | bé / em bé | con (trừ context xưng hô của user) |
| Tuần thai | tuần thai | tuần thứ N (dài) |
| Bú mẹ | bú mẹ | cho con bú (verb form, OK trong context) |
| Tã | tã | bỉm (regional — only if branding allows) |
| Cân nặng | cân nặng | trọng lượng (quá kỹ thuật) |
| Khám thai | khám thai | siêu âm thai (chỉ khi đúng là siêu âm) |
| Tiêm phòng | tiêm chủng / tiêm phòng | chích ngừa (Nam Bộ; OK nếu nhắm vùng) |
| Mốc phát triển | mốc phát triển | milestone (Anh ngữ) |
| Đăng ký | đăng ký | đăng kí (sai chính tả phổ biến) |

### 2. AI disclaimer text

Every AI-rendered surface must include — exact or close variant:

> Thông tin từ AI, không thay thế ý kiến bác sĩ.

Flag missing, inconsistent, or watered-down variants.

### 3. Risk-level badge labels

- Green: "Bình thường" / "Ổn"
- Yellow: "Cần theo dõi" / "Lưu ý"
- Red: "Cần khám bác sĩ" / "Nguy hiểm — hãy đi khám"

NEVER use clinical labels like "Cấp độ 1/2/3".

### 4. Empty / error / loading states

- Empty: invite, never blame. "Bắt đầu ghi lại nhé!" not "Bạn chưa nhập gì cả".
- Error: explain + offer retry. "Có chút trục trặc, thử lại sau ít phút nhé." not "Lỗi 500".
- Loading: rarely needs text — but if it does, "Đang tải..." is enough.

### 5. Push notification templates

- Always include the baby's name if applicable: "Đến giờ Bo bú rồi!" > "Đến giờ bú".
- Keep under ~80 chars to fit notification preview.
- Avoid all-caps and excessive `!`.

### 6. Translation-shape phrases

Flag English-shaped translations:

- ❌ "Vui lòng nhập một địa chỉ email hợp lệ" → ✅ "Nhập email hợp lệ nhé"
- ❌ "Bạn có chắc chắn muốn xóa?" → ✅ "Xóa luôn nhé?"
- ❌ "Đã được thêm thành công" → ✅ "Đã thêm xong"
- ❌ "Lỗi xảy ra" → ✅ "Có lỗi rồi"

### 7. Accent / typo

Common typos to grep: `đăng kí` (→ đăng ký), `xử lí` (→ xử lý), `xảy ra` ✓, `xảy ra` mis-typed, `mặc dù` (not `mặc dầu` for modern usage), missing diacritics in any user-facing string.

## How to run

1. Grep all `.tsx`, `.ts` files under `app/`, `components/` for Vietnamese strings — heuristic: any double-quoted string containing UTF-8 Vietnamese chars (`à-ỹ`).
2. Pull push notification copy from `supabase/functions/push-notify/` and any notification template file.
3. Read Edge Function system prompts in `supabase/functions/ai-*/` — flag any cold/clinical phrasing.
4. Build a table of inconsistent term usage.

## Report format

```
## Vietnamese Copy Review — <date>

### Coverage
<N> screens, <M> notification templates, <K> AI prompts audited

### 🔴 Must fix
- <file:line> — "<bad copy>" → "<suggested>" (reason)

### 🟡 Suggestions
- terminology drift: "bỉm" vs "tã" across 3 screens — pick one

### 🟢 Notes
- Tone consistent in onboarding flow
- AI disclaimer present on N/M AI surfaces (missing on: ...)
```

## Don't

- Don't auto-fix — write the report and let user / vn-content-curator agent apply changes.
- Don't impose Northern vs Southern dialect — only flag if mixed inconsistently in the same flow.
- Don't rewrite expert-written medical content; only flag tone issues.
