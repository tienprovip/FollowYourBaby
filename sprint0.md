# Sprint 0 — Foundation Report
**Ngày:** 2026-05-13  
**Trạng thái:** Hoàn thành  
**Agent chạy:** expo-bootstrap → supabase-architect → ui-component-library

---

## Tổng quan

Sprint 0 khởi tạo toàn bộ nền tảng kỹ thuật cho FollowYourBaby từ một thư mục rỗng. Ba agent chạy tuần tự, mỗi agent bàn giao output cho agent tiếp theo.

---

## 1. expo-bootstrap — Khởi tạo dự án Expo

### Mục tiêu
Tạo skeleton Expo managed-workflow đúng chuẩn CLAUDE.md để các agent tính năng có thể xây lên.

### Đã làm
**Cài đặt & cấu hình:**
- `package.json` với toàn bộ dependencies: Expo SDK 52, React 18.3.1, React Native 0.76.x
- `tsconfig.json` — strict mode, path alias `@/*` → root
- `app.json` — scheme, tên app, expo-router plugin, notifications plugin
- `babel.config.js` — nativewind/babel preset
- `metro.config.js` — withNativeWind wrapper
- `tailwind.config.js` — bảng màu pastel (rose, mint, cream, soft-blue) phù hợp mẹ bầu/phụ huynh
- `global.css` — Tailwind directives
- `.env`, `.gitignore`, `.prettierrc`, `.eslintrc.js`

**Cấu trúc thư mục:**
```
app/
  _layout.tsx          ← RootLayout: QueryClientProvider + SafeAreaProvider + Stack
  (auth)/              ← Auth screens (auth-builder sẽ điền)
  (onboarding)/        ← Onboarding flow (onboarding-builder sẽ điền)
  (tabs)/              ← Main tabs (dashboard-builder sẽ điền)
components/ui/         ← UI primitives (ui-component-library sẽ điền)
components/tracking/   ← Tracking components
components/charts/     ← Biểu đồ
components/ai/         ← AI chat UI
lib/
  supabase.ts          ← Supabase client với expo-secure-store adapter
  queryClient.ts       ← TanStack Query (staleTime 60s, retry 1)
  constants.ts         ← Color tokens, risk levels, app metadata
stores/
  authStore.ts         ← Auth state (Zustand)
  babyStore.ts         ← Active baby/profile state
  uiStore.ts           ← UI state (modals, loaders)
types/
  app.ts               ← App-specific types
  database.ts          ← Stub (supabase-architect thay thế)
supabase/functions/    ← Edge Functions (ai-edge-function-builder)
supabase/migrations/   ← Migrations (supabase-architect)
assets/fonts/
assets/images/
```

**Kết quả:**
- 1,203 packages installed thành công
- `npx tsc --noEmit` → 0 lỗi, 0 cảnh báo

---

## 2. supabase-architect — Schema, RLS và Types

### Mục tiêu
Thiết kế toàn bộ schema PostgreSQL, chính sách bảo mật RLS, storage buckets và TypeScript types để các feature agent có thể truy vấn data an toàn.

### Đã làm

**`supabase/migrations/0001_init.sql` — Schema:**
- Extensions: `uuid-ossp`, `pgcrypto`
- 18 PostgreSQL enums (user role, pregnancy status, feed type, sleep kind, v.v.)
- **26 tables:**

| Nhóm | Tables |
|---|---|
| Identity & permissions | `profiles`, `pregnancies`, `babies`, `care_shares`, `baby_health_profile` |
| Pregnancy tracking | `pregnancy_weights`, `kick_counts`, `pregnancy_symptoms`, `prenatal_visits`, `pregnancy_medications` |
| Baby tracking | `feed_logs`, `sleep_logs`, `diaper_logs`, `growth_logs`, `symptom_logs`, `medication_logs`, `activity_logs` |
| Milestones & knowledge | `milestones`, `milestone_catalog`, `articles` |
| AI & notifications | `ai_conversations`, `ai_messages`, `ai_memory`, `notification_schedules`, `expo_push_tokens` |
| Subscriptions | `subscriptions` |

- Trigger `set_updated_at()` dùng chung cho tất cả bảng có `updated_at`
- Indexes trên `owner_id`, `baby_id`, `pregnancy_id`, `recorded_at`, `created_at`

**`supabase/migrations/0002_rls.sql` — Bảo mật:**
- RLS enabled trên tất cả 26 tables
- Hàm helper `has_resource_access(resource_type, resource_id, min_permission)` — kiểm tra care_shares
- Hàm helper `permission_gte(actual, required)` — so sánh mức quyền (view < edit < full)
- **97 table-level policies** — SELECT/INSERT/UPDATE/DELETE per table
- Logic phân quyền:
  - `milestone_catalog`, `articles` → public read
  - `ai_memory`, `subscriptions` → owner-only
  - Baby/pregnancy tables → owner OR care_shares với quyền phù hợp

**`supabase/migrations/0003_storage.sql` — Storage:**
- 4 buckets: `avatars` (public), `baby-photos` (private), `ultrasounds` (private), `medical-docs` (private)
- 16 storage RLS policies với path convention: `{bucket}/{resource_id}/...`

**`supabase/migrations/0004_seed.sql` — Dữ liệu mẫu:**
- **32 mốc phát triển** WHO/CDC bằng tiếng Việt:
  - Motor: 15 entries (lẫy, ngồi, đứng, đi, v.v.)
  - Language: 8 entries (babbling, từ đầu tiên, câu 2 từ, v.v.)
  - Cognitive: 4 entries
  - Social: 5 entries
- **5 bài viết mẫu** tiếng Việt để seed kho kiến thức

**`types/database.ts` — TypeScript types (hand-generated):**
- Export `Database` interface tương thích `SupabaseClient<Database>` v2
- Helpers: `Tables<T>`, `InsertTables<T>`, `UpdateTables<T>`, `Enums<T>`
- 18 TypeScript enum union types

**Kết quả:**
- 26 tables, 113 policies tổng (97 table + 16 storage)
- RLS audit: tất cả bảng đều có RLS và ít nhất 1 policy ✓
- Share-care pattern đúng chuẩn ✓

---

## 3. ui-component-library — UI Primitives

### Mục tiêu
Xây dựng bộ component dùng chung để các feature agent import thay vì tự tạo UI riêng, đảm bảo nhất quán thiết kế.

### Đã làm

**`lib/cn.ts`** — className merger (clsx + tailwind-merge inline, không cần install thêm)

**18 components trong `components/ui/`:**

| Component | Mô tả |
|---|---|
| `Button` | primary/secondary/ghost/destructive; sm/md/lg; loading "Đang tải...", icon left/right |
| `Input` | text/email/numeric/password; label, error, helperText, prefix/suffix, show/hide password |
| `FormField` | Wraps Input với react-hook-form Controller |
| `Card` | padding none/sm/md/lg; optional header/footer; tappable |
| `Badge` | green/yellow/red/neutral pill badge |
| `RiskBadge` | Chuyên biệt: green="An toàn", yellow="Theo dõi", red="Cần khám" |
| `AIDisclaimer` | Banner bắt buộc: "AI hỗ trợ — không thay thế bác sĩ. Hãy hỏi chuyên gia khi cần." |
| `Avatar` | Image hoặc initials; xs/sm/md/lg |
| `IconButton` | Circular, min 44pt (iOS HIG), filled/outline/ghost |
| `Modal` | Centered modal với backdrop, dismiss khi ấn ngoài |
| `BottomSheet` | Slide-up với PanResponder drag-to-dismiss — không dùng @gorhom/bottom-sheet |
| `EmptyState` | Illustration slot + title + body + CTA tùy chọn |
| `LoadingSpinner` | ActivityIndicator wrapper; small/medium/large |
| `ErrorState` | title + message + retry CTA |
| `Toast` / `useToast` | In-app toast với Animated; success/info/warning/error |
| `Stepper` | Progress onboarding indicator |
| `DateField` | Stub có TODO (cần install @react-native-community/datetimepicker) |
| `TimeField` | Stub có TODO (cùng dep trên) |
| `SegmentedControl` | Animated pill tabs cho tracking screens |

**`components/ui/index.ts`** — barrel export tất cả components và prop interfaces

**Kết quả:**
- `npx tsc --noEmit` → 0 lỗi ✓
- Secret scan: không có API key/service_role nào trong client ✓
- VN copy review: tone ấm áp, không jargon y tế, terminology nhất quán ✓

---

## Audit tổng hợp

| Skill | Kết quả |
|---|---|
| `secret-scan` (client files) | ✅ Pass — Không leak ANTHROPIC_API_KEY hay service_role key |
| `rls-audit` (migrations) | ✅ Pass — 26/26 tables có RLS; share-care pattern đúng |
| `vn-copy-review` | ✅ Pass — Tiếng Việt ấm áp, nhất quán |

---

## Những gì CẦN làm trước khi chạy app

1. **Điền các biến vào `.env`:**
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
   EXPO_PUBLIC_PROJECT_ID=<eas-project-id>
   ```

2. **Cập nhật `lib/supabase.ts`** để dùng generic `Database` type:
   ```ts
   import { Database } from '../types/database'
   const supabase = createClient<Database>(url, key, ...)
   ```
   _(auth-builder agent sẽ làm việc này)_

3. **Install dep còn thiếu** (khi cần):
   ```bash
   npx expo install @react-native-community/datetimepicker
   npm install clsx tailwind-merge
   ```

4. **Chạy Supabase migrations** khi có project Supabase:
   ```bash
   supabase db reset
   supabase gen types typescript --local > types/database.ts
   ```

---

## Sprint tiếp theo

**Sprint 1** — Auth + Onboarding:
- `auth-builder` — email sign-up/in, Google/Apple/Facebook, OTP, secure token storage
- `onboarding-builder` — chọn hành trình, khảo sát ban đầu, cá nhân hóa dashboard
- `profile-permissions-builder` — quản lý profile, nhiều bé, chia sẻ quyền chăm sóc
