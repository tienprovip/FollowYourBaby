# FollowYourBaby — Project Intelligence

## Project Overview

**FollowYourBaby** is an AI-powered parenting companion designed for Vietnamese parents and caregivers. The product connects daily maternity and baby care tracking with an intelligent assistant, personalized recommendations, and health-aware notifications.

This SRS organizes features into two phases:

- **Phase 1 — Sản phẩm cốt lõi (B2C):** xây dựng app đủ mạnh để mẹ bầu / phụ huynh dùng mỗi ngày.
- **Phase 2 — Mở rộng & kiếm tiền:** mở rộng hệ sinh thái, B2B, affiliate, community và automation.

**Core value:** Giúp người dùng cảm thấy “app này giúp mình mỗi ngày” với trải nghiệm cá nhân hóa, đơn giản và an toàn.

---

## Tech Stack

### Mobile

- **React Native + Expo** (managed workflow)
- **TypeScript**
- **Expo Router**
- **TanStack Query**
- **Zustand**
- **NativeWind**

### Backend

- **Supabase**
  - Auth (email, social login, OTP)
  - PostgreSQL
  - Storage
  - Edge Functions
  - Realtime
- **Supabase Edge Functions** cho AI, báo cáo và automation

### AI

- **Anthropic Claude** (via secure server-side integration)
- Context engine: profile + timeline + log data
- AI dùng để chat, summary, cảnh báo, recommendation và phân tích trạng thái

### Integrations

- **SMS / OTP provider** cho đăng ký số điện thoại
- **Push notification** qua Expo Notifications
- **OCR / document scan** cho hồ sơ khám thai và siêu âm

---

## Design System

### Product Style

Dịu nhẹ · Ấm áp · Đáng tin cậy · Hiện đại · Tối giản · AI-first  
Tone cảm xúc: bình yên, an toàn, chăm sóc, yêu thương.

### Color Palette

| Token | Hex | Tailwind class | Dùng cho |
|---|---|---|---|
| Soft Pink | `#FF8FA8` | `brand-pink` / `brand-pink-400` | Primary action |
| Lavender | `#B79CFF` | `brand-lavender` / `brand-lavender-400` | AI / Highlight |
| Peach Cream | `#FFF3EC` | `brand-peach` | Background |
| Baby Blue | `#A9D6FF` | `brand-blue` | Baby tracking |
| Mint Green | `#AEE6C8` | `brand-mint` | Success |
| Warm Gray | `#F7F7F7` | `brand-gray` | Cards |
| Dark Navy | `#1F2B5B` | `brand-navy` | Text |

### Typography

| Role | Weight | Font |
|---|---|---|
| Heading | 700 | Nunito (rounded, friendly) |
| Body | 400–500 | Nunito / System |

Expo font setup: load `Nunito` via `expo-font` + `useFonts`. Tailwind key: `font-sans` / `font-display`.

### Border Radius Tokens

| Component | Value | Tailwind token |
|---|---|---|
| Card | 24px | `rounded-card` |
| Button | 18px | `rounded-btn` |
| Input | 16px | `rounded-input` |
| Modal / Bottom Sheet | 28px | `rounded-modal` |

### Shadow

Soft floating shadow: `0 8px 24px rgba(0,0,0,0.08)`.  
Tailwind token: `shadow-brand`. Heavier variant: `shadow-brand-lg`.

### Component Mapping

| Component | Primary color | Radius token |
|---|---|---|
| `<Button variant="primary">` | `brand-pink` | `rounded-btn` |
| `<Button variant="ai">` | `brand-lavender` | `rounded-btn` |
| `<Card>` | white bg, `brand-gray` border | `rounded-card` |
| `<Input>` | `brand-pink-200` border, `brand-navy` text | `rounded-input` |
| `<Modal>` | white | `rounded-modal` |
| `<BottomSheet>` | white | `rounded-t-card` |
| `<Badge variant="lavender">` | `brand-lavender` | `rounded-full` |
| `<AIDisclaimer>` | `brand-lavender-50` bg | `rounded-input` |

---

## Quy tắc thiết kế

### 1. Người dùng là trung tâm

- Thiết kế cho mẹ bầu và phụ huynh Việt Nam.
- Giao diện dễ dùng mọi ngày, hành trình rõ ràng, thông tin nhạy cảm được hiển thị vừa đủ.

### 2. Cá nhân hóa và ngữ cảnh

- Khởi tạo onboarding theo giai đoạn: mang thai / có em bé / nhiều bé.
- Tự động ưu tiên module phù hợp với hành trình và thực trạng.
- AI phải hiểu hồ sơ, lịch sử và thói quen để đưa ra gợi ý chính xác.

### 3. An toàn và tin cậy

- Không thay thế bác sĩ.
- Luôn có cảnh báo khi cần khám.
- Giải thích rõ ràng khi AI đưa ra đề xuất.

### 4. Đơn giản và trực quan

- Tối ưu mobile-first.
- Tránh mô-đun quá phức tạp ban đầu.
- Ưu tiên tính năng dùng được ngay và không gây quá tải.

### 5. Mở rộng và linh hoạt

- Thiết kế dữ liệu và UI để mở rộng dễ dàng sang B2B, affiliate và community.
- Giữ module tracking, AI và subscription tách biệt.

---

## Quy tắc bắt buộc

### 1. Bảo mật dữ liệu

- Mã hóa và bảo vệ thông tin người dùng.
- Tuyệt đối không lộ API key máy chủ như `ANTHROPIC_API_KEY` trong client.
- Xác thực và phân quyền rõ ràng cho chia sẻ quyền chăm sóc.

### 2. Quyền riêng tư

- Tôn trọng dữ liệu cá nhân của bé, mẹ và gia đình.
- Chỉ lưu dữ liệu cần thiết cho tính năng.
- Không dùng dữ liệu y tế cho mục đích khác nếu chưa có phép.

### 3. AI an toàn

- Luôn kèm cảnh báo “không thay thế bác sĩ”.
- Phân loại mức độ nguy hiểm: xanh / vàng / đỏ.
- Có fallback khi Claude trả lời thiếu hoặc phản hồi không phù hợp.

### 4. Ổn định và hiệu suất

- App phải tải nhanh, offline cơ bản và giữ trạng thái khi mất mạng.
- API phải có timeout và xử lý lỗi rõ.
- Push notification và nhắc việc phải hoạt động tin cậy.

### 5. Phân quyền chính xác

- Hỗ trợ xem, chỉnh sửa và toàn quyền khi chia sẻ.
- Người dùng chính, người phụ và người trông trẻ chỉ có quyền phù hợp.

### 6. Tính hợp chuẩn

- Tuân thủ các luật về dữ liệu cá nhân và y tế phổ biến ở Việt Nam.
- Chú ý logo, biểu tượng và nội dung không gây nhầm lẫn thành dịch vụ y tế chính thức.

---

## Workflow

### Phase 1 — Sản phẩm cốt lõi (B2C)

#### 1. Xác thực & quản lý tài khoản

- Email sign-up / sign-in
- OTP qua số điện thoại
- Google / Apple / Facebook login
- Đăng xuất, quên mật khẩu, refresh session
- Hồ sơ người dùng với vai trò: Mẹ bầu, Phụ huynh, Người chăm sóc
- Quản lý nhiều bé và nhiều thai kỳ
- Chia sẻ quyền chăm sóc với phân quyền: xem / chỉnh sửa / toàn quyền

#### 2. Onboarding

- Chọn hành trình: mang thai / có em bé / nhiều bé
- Khảo sát ban đầu: tuổi bé, tuần thai, mối quan tâm, mục tiêu chăm sóc
- Cá nhân hoá dashboard và module cần dùng
- Gợi ý AI ban đầu theo hồ sơ

#### 3. Module mẹ bầu

- Dashboard thai kỳ: tuần thai, ngày dự sinh, tóm tắt hôm nay
- Theo dõi cân nặng và biểu đồ so chuẩn
- Theo dõi thai máy và nhật ký hàng ngày
- Track triệu chứng: buồn nôn, mệt mỏi, đau lưng, phù, tâm trạng
- Lịch khám thai, siêu âm, xét nghiệm với nhắc nhở
- Theo dõi thuốc/vitamin và thông báo
- Hướng dẫn theo tuần về thai nhi, cơ thể mẹ, nên làm/không nên làm
- Lưu hồ sơ khám thai, ảnh siêu âm và timeline
- OCR trích xuất thông tin từ phiếu khám thai
- Cảnh báo nguy cơ khi thai máy giảm hoặc triệu chứng bất thường

#### 4. Hồ sơ em bé

- Hồ sơ cơ bản: tên, ngày sinh, giới tính, cân nặng sơ sinh, chiều cao
- Hồ sơ sức khỏe: dị ứng, thuốc, tiền sử bệnh

#### 5. Theo dõi em bé

- Bú / ăn: bú mẹ, bình sữa, ăn dặm
- Giấc ngủ: ngày/đêm, tổng thời gian, sleep regression
- Tã: ướt/bẩn, ghi chú
- Tăng trưởng: cân nặng, chiều cao, vòng đầu + biểu đồ
- Sức khỏe: sốt, triệu chứng, thuốc
- Hoạt động: tummy time, tập bò, tập đi

#### 6. Mốc phát triển

- Vận động: lẫy, bò, đi
- Ngôn ngữ: bập bẹ, nói từ đầu tiên
- Nhận thức và tương tác xã hội
- Cảnh báo nguy cơ chậm phát triển từ AI

#### 7. Trợ lý AI cốt lõi

- Chat theo ngữ cảnh với hồ sơ bé và lịch sử nhật ký
- Gợi ý cá nhân hoá: nên làm gì, nên theo dõi gì tiếp
- Tóm tắt mỗi ngày: giấc ngủ, ăn, thay đổi
- Cảnh báo chủ động: sleep regression, bú ít hơn
- Phân loại mức độ nguy hiểm
- Bộ nhớ AI lưu dị ứng, thói quen, lịch sử

#### 8. Thông báo thông minh

- Nhắc việc: bú, uống thuốc, ngủ
- Nhắc sự kiện: tiêm phòng, khám định kỳ
- Push insight từ AI

#### 9. Dashboard phân tích

- Tổng quan ngày
- Báo cáo tuần
- Báo cáo tháng bằng AI

#### 10. Kho kiến thức

- Thư viện bài viết
- Tìm kiếm
- AI giải thích nội dung

#### 11. Gói trả phí

- Miễn phí, Premium, Family Premium

#### 12. Trang quản trị

- Quản lý người dùng
- Quản lý nội dung
- Giám sát AI

### Phase 2 — Mở rộng & kiếm tiền

#### A. Khối B2B

- Dashboard cho phòng khám sản và nhi
- White-label cho phòng khám theo thương hiệu riêng
- Cổng bác sĩ: xem dữ liệu bệnh nhân, ghi chú, gửi lời khuyên
- Gửi thông báo hàng loạt cho chiến dịch sức khỏe
- Phân tích dữ liệu phòng khám

#### B. Affiliate / Thương mại

- Gợi ý sản phẩm cá nhân hoá: bỉm, sữa, ghế ăn dặm, đồ chơi
- Theo dõi chuyển đổi click / mua / hoa hồng
- Cửa hàng cá nhân hoá

#### C. Community / Communication

- Bảng tin cộng đồng
- Bình luận / trả lời
- Chuyên gia xác thực
- Nhóm chủ đề
- Nhắn tin trực tiếp giữa phụ huynh và chuyên gia
- Challenge cộng đồng

#### D. Communication Automation

- AI gửi nội dung định kỳ
- Push campaign builder
- Lifecycle messaging theo mốc thai kỳ và em bé

#### E. AI nâng cao

- Dự đoán sức khỏe
- Dự đoán chậm phát triển
- Phân tích hồ sơ y tế chuyên sâu

#### F. Tích hợp đối tác

- API phòng khám
- Tích hợp bảo hiểm
- Tích hợp nhà thuốc

### Sprint sequence

- Sprint 1–2: Auth + onboarding + profile
- Sprint 3–5: Tracking mẹ bầu + tracking bé
- Sprint 6–7: AI assistant
- Sprint 8: Dashboard + notification
- Sprint 9: Subscription
- Sau khi có người dùng ổn định: bắt đầu Phase 2

### Sprint checklist

> Cập nhật trạng thái khi hoàn thành: `[ ]` → `[x]`. Giữ checklist này đồng bộ với tiến độ thực tế để AI và dev mới nắm được phase hiện tại.

- [x] Sprint 1: Thiết lập Expo + Supabase, đăng ký email, đăng nhập, đăng xuất
- [x] Sprint 1: Xây onboarding chọn hành trình và thu thập hồ sơ người dùng
- [x] Sprint 2: Quản lý profile người dùng, nhiều bé, nhiều thai kỳ
- [x] Sprint 2: Chia sẻ quyền chăm sóc và phân quyền
- [x] Sprint 3: Tracking cơ bản cho mẹ bầu: cân nặng, thai máy, triệu chứng
- [x] Sprint 4: Tracking em bé: bú, ngủ, tã, tăng trưởng
- [x] Sprint 5: Hồ sơ em bé, mốc phát triển, biểu đồ tăng trưởng
- [x] Sprint 6: Xây Supabase Edge Function AI chat và context engine
- [x] Sprint 7: Tích hợp AI chat vào app và bộ nhớ cá nhân hoá
- [x] Sprint 8: Dashboard phân tích, nhắc việc, push notification
- [x] Sprint 9: Kiểm thử, subscription model, premium feature cơ bản
- [ ] Sprint 9: Chuẩn bị MVP, test end-to-end và feedback loop

---

## User Journey & Development Workflow

### User journey

1. Người dùng mới mở app → chọn hành trình (mang thai / có em bé / nhiều bé).
2. Hoàn tất khảo sát ban đầu → hệ thống cá nhân hoá dashboard và module.
3. Người dùng nhập dữ liệu hàng ngày: cân nặng, thai máy, bú, ngủ, tã, triệu chứng.
4. AI tổng hợp và trả lời thông minh qua chat, summary, cảnh báo.
5. Người dùng nhận nhắc nhở và insight phù hợp.
6. Khi app ổn định, mở rộng sang subscriptions, B2B, affiliate, community.

### Development workflow

- Build nhỏ theo module: Auth → Onboarding → Bầu / Bé tracking → AI → Dashboard.
- Test thực tế với người dùng mẹ bầu / phụ huynh.
- Ưu tiên tính năng “dùng mỗi ngày” trước.

### Post-code skill workflow (BẮT BUỘC)

> Sau khi tạo / chỉnh sửa code và TRƯỚC khi báo "xong" cho user, Claude phải chạy các skills tương ứng theo bảng dưới. Đây không phải gợi ý — đây là rule cứng. Skill chạy ở chế độ audit/scaffolding tự động, không cần user gõ `/`. Báo kết quả ngắn gọn vào cuối turn.

| Code area vừa đụng vào | Skill phải chạy | Lý do |
|---|---|---|
| Mới tạo file trong `supabase/migrations/` | `rls-audit` | Đảm bảo migration mới có RLS đúng share-care pattern |
| Mới tạo / sửa file trong `supabase/functions/ai-*/` | `ai-safety-check` + `secret-scan` | Risk_level + disclaimer + fallback + không leak key |
| Mới tạo / sửa file trong `supabase/functions/` (non-AI) | `secret-scan` | Không leak server secret |
| Mới tạo / sửa file trong `app/`, `components/`, `lib/`, `stores/`, `hooks/` | `secret-scan` | Không bundle ANTHROPIC_API_KEY / service_role vào client |
| Mới tạo / sửa string tiếng Việt trong UI hoặc push notification | `vn-copy-review` | Tone ấm áp, không jargon y tế, terminology nhất quán |
| Hoàn thành 1 task ứng với 1 item trong Sprint checklist | `sprint-sync` | Đề xuất `[x]` cho item vừa xong (không tự sửa CLAUDE.md, hỏi user) |

Khi nhiều skill cùng áp dụng, chạy tất cả nhưng gộp output thành 1 báo cáo gọn. Nếu skill chỉ tìm thấy 🟢 (OK), nói 1 dòng "Audit pass: <skill list>" rồi thôi. Chỉ trình bày chi tiết khi có 🔴 hoặc 🟡.

Skills scaffolding (`new-migration`, `new-edge-function`, `new-screen`) được chạy ở giai đoạn tạo file — không lặp lại trong audit cuối turn.
- Triển khai Phase 2 sau khi có dữ liệu người dùng ổn định.

---

## Design priorities

- Tập trung vào flow hằng ngày thay vì feature quá rộng.
- Giải quyết pain point: theo dõi sức khỏe, nhắc việc, gợi ý AI tin cậy.
- Giữ core app nhẹ, dễ triển khai và dễ mở rộng.

---

## Mandatory product principles

- Người dùng phải cảm thấy sản phẩm hữu ích ngay từ lần đầu.
- Mọi AI output phải có giới hạn và cảnh báo y tế rõ ràng.
- Dữ liệu trẻ em và thai phụ phải được xử lý cẩn trọng.
- Phân quyền chia sẻ phải chính xác, dễ quản lý.
- Không deploy tính năng B2B/affiliate trước khi Phase 1 vận hành ổn định.

---

## Project Structure

```
FollowYourBaby/
├── app/                        # Expo Router — file-based routing
│   ├── (auth)/                 # Auth group: login, register, forgot-password
│   ├── (onboarding)/           # Onboarding flow
│   ├── (tabs)/                 # Main tab navigator sau khi đăng nhập
│   │   ├── index.tsx           # Dashboard (home)
│   │   ├── tracking.tsx        # Tracking hàng ngày
│   │   ├── ai-chat.tsx         # Trợ lý AI
│   │   ├── milestones.tsx      # Mốc phát triển
│   │   └── profile.tsx         # Hồ sơ người dùng & cài đặt
│   └── _layout.tsx             # Root layout
├── components/                 # Shared UI components
│   ├── ui/                     # Primitives: Button, Input, Card, Badge
│   ├── tracking/               # Components cho tracking (bé, mẹ bầu)
│   ├── charts/                 # Biểu đồ tăng trưởng, cân nặng
│   └── ai/                     # AI chat bubble, warning badge
├── lib/                        # Utilities & configs
│   ├── supabase.ts             # Supabase client init
│   ├── queryClient.ts          # TanStack Query client
│   └── constants.ts            # App-wide constants
├── stores/                     # Zustand stores
│   ├── authStore.ts            # Auth state
│   ├── babyStore.ts            # Active baby / profile
│   └── uiStore.ts              # UI state (modals, loaders)
├── hooks/                      # Custom React hooks
├── types/                      # TypeScript type definitions
│   ├── database.ts             # Supabase DB types (auto-generated)
│   └── app.ts                  # App-specific types
├── supabase/
│   ├── functions/              # Edge Functions
│   │   ├── ai-chat/            # AI chat context engine
│   │   ├── ai-summary/         # Daily/weekly summary
│   │   └── push-notify/        # Push notification trigger
│   └── migrations/             # SQL migrations
└── assets/                     # Fonts, images, icons
```

> Cập nhật section này khi thêm module mới để giữ map chính xác.

---

## Code Conventions

### TypeScript

- Luôn dùng TypeScript strict mode. Không dùng `any` — thay bằng `unknown` hoặc type cụ thể.
- DB types generate từ Supabase CLI vào `types/database.ts`, không viết tay.
- Props component dùng `interface`, không dùng `type` (trừ union types).

### Naming

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Component | PascalCase | `TrackingCard.tsx` |
| Hook | camelCase + `use` prefix | `useBabyProfile.ts` |
| Store | camelCase + `Store` suffix | `authStore.ts` |
| Utility function | camelCase | `formatWeight.ts` |
| Supabase table | snake_case | `baby_profiles` |
| Edge Function | kebab-case | `ai-chat/` |

### Component structure

```tsx
// 1. Imports
// 2. Types/interfaces
// 3. Component function
// 4. Styles (nếu có StyleSheet)
export default function ComponentName({ prop }: Props) { ... }
```

### State management

- **Server state** (data từ Supabase): TanStack Query — không lưu vào Zustand.
- **Client/UI state** (modals, tabs, form state): Zustand hoặc `useState` local.
- Không fetch data trực tiếp trong component — luôn qua custom hook.

### Styling

- Dùng NativeWind (Tailwind cho React Native) cho phần lớn styling.
- Dùng `StyleSheet.create` chỉ khi cần dynamic styles hoặc animations.
- Responsive: dùng `useWindowDimensions` thay vì hard-code pixel.

### AI safety

- Mọi response từ Edge Function AI phải kèm `risk_level: 'green' | 'yellow' | 'red'`.
- UI phải hiển thị disclaimer "Không thay thế bác sĩ" trên mọi AI output.
- Xử lý fallback khi Edge Function timeout hoặc trả về lỗi.

---

## Environment Setup

### Yêu cầu

- Node.js >= 20
- npm >= 10 hoặc bun >= 1.1
- Expo CLI: `npm install -g expo-cli`
- Supabase CLI: `npm install -g supabase`
- EAS CLI (cho build/deploy): `npm install -g eas-cli`

### Cài đặt local

```bash
# Clone và cài dependencies
git clone <repo>
cd FollowYourBaby
npm install

# Tạo file env
# Điền các biến vào .env

# Chạy app
npx expo start
```

### Biến môi trường

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# Chỉ dùng server-side (Edge Functions) — KHÔNG đưa vào client
ANTHROPIC_API_KEY=<secret>

# Push notifications
EXPO_PUBLIC_PROJECT_ID=<eas-project-id>
```

> `EXPO_PUBLIC_` prefix → bundle vào client app (an toàn cho public keys).
> Không có prefix → chỉ dùng trong Edge Functions / server.

### Supabase local dev

```bash
# Khởi động Supabase local
supabase start

# Chạy migrations
supabase db reset

# Generate TypeScript types từ schema
supabase gen types typescript --local > types/database.ts

# Deploy Edge Functions lên local
supabase functions serve ai-chat --env-file .env
```

### Chạy Edge Functions production

```bash
supabase functions deploy ai-chat
supabase functions deploy ai-summary
supabase functions deploy push-notify
```
