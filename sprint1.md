# Sprint 1 — Auth Module

**Trạng thái:** hoàn thành (client-side)
**Sprint:** 1 — Thiết lập Expo + Supabase, đăng ký email, đăng nhập, đăng xuất

---

## Những gì đã xây dựng

### Màn hình auth (`app/(auth)/`)

| File | Mô tả |
|---|---|
| `_layout.tsx` | Stack navigator không header, nền cream `#fffdf7`, animation `slide_from_right` |
| `login.tsx` | Đăng nhập email/password, quên mật khẩu, social login stubs |
| `register.tsx` | Đăng ký tài khoản, password checklist trực quan, success state email verification |
| `forgot-password.tsx` | Gửi link đặt lại, success state hiện email đã gửi, escape hatch "thử email khác" |

### State & logic

| File | Mô tả |
|---|---|
| `stores/authStore.ts` | Zustand store đầy đủ: session, user, isLoading; subscribe `onAuthStateChange`; sign-in / sign-up / sign-out / password reset |
| `hooks/useAuth.ts` | Hook gọi `initialize()` đúng một lần; wrap lỗi qua `mapAuthError`; expose `signIn`, `signUp`, `signOut`, `sendPasswordReset` |
| `lib/authErrors.ts` | Map 15+ Supabase error patterns → thông báo tiếng Việt ấm áp, không để lộ raw JSON |
| `lib/zodResolver.ts` | Inline resolver cho react-hook-form v7 + Zod, không cần cài thêm `@hookform/resolvers` |

### Session gate

`app/index.tsx` (thay thế file gốc):
- Loading → `<LoadingSpinner />`
- Đã đăng nhập → redirect `/(tabs)/index`
- Chưa đăng nhập → redirect `/(auth)/login`

---

## Luồng người dùng

```
Mở app
  └─ index.tsx đọc session từ SecureStore
       ├─ [có session] → /(tabs)/index
       └─ [chưa đăng nhập] → /(auth)/login
            ├─ Đăng nhập thành công → /(tabs)/index
            ├─ Quên mật khẩu → /(auth)/forgot-password
            └─ Chưa có tài khoản → /(auth)/register
                 └─ Đăng ký xong → hiện "Kiểm tra hộp thư" → về login
```

---

## Chi tiết kỹ thuật

### authStore — session lifecycle

```
initialize()
  ├─ supabase.auth.getSession()   ← đọc từ SecureStore (đã cấu hình trong lib/supabase.ts)
  ├─ set { session, user, isLoading: false }
  └─ supabase.auth.onAuthStateChange(...)  ← subscribe 1 lần, guard bằng _authSubscription ref

signOut()
  ├─ sub.unsubscribe()   ← tránh spurious state update
  └─ supabase.auth.signOut()
```

### mapSupabaseUser — mapping metadata

Đọc `user_metadata` theo thứ tự ưu tiên:
- `display_name` → `full_name` → `name` → fallback email prefix
- `avatar_url` → `picture` → `null`
- `role` / `journey` default: `'parent'` / `'has_baby'` (onboarding sẽ ghi đè)

### Validation (Zod)

**Login:** email format + password min 8 ký tự

**Register:**
- Họ và tên: 2–60 ký tự
- Email: format hợp lệ
- Mật khẩu: min 8, có ít nhất 1 chữ hoa, 1 chữ số
- Xác nhận mật khẩu: `.refine()` kiểm tra khớp

**Forgot password:** email format

### Social login

Các nút Google / Apple / Facebook hiện tại là **stub** — nhấn vào hiện Toast `"Sắp ra mắt — tính năng này đang được phát triển."`. Sẽ triển khai bằng `expo-auth-session` + `supabase.auth.signInWithIdToken` ở sprint sau khi cấu hình OAuth provider trong Supabase dashboard.

---

## Cấu hình cần làm trước khi test

1. Tạo file `.env` từ `.env.example` và điền:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
   ```

2. Trong Supabase dashboard → Authentication → Email: đảm bảo "Confirm email" được bật để luồng xác nhận email hoạt động đúng.

3. (Tùy chọn) Tắt email confirmation trong Supabase khi test local để bỏ qua bước xác nhận.

---

## Những gì chưa làm (defer sang sprint sau)

| Hạng mục | Sprint |
|---|---|
| Social login: Google / Apple / Facebook | Sprint 2+ (sau khi cấu hình OAuth) |
| OTP qua số điện thoại | Sprint 2 |
| ~~Onboarding flow sau đăng ký~~ | ✅ Hoàn thành (xem bên dưới) |
| Profile management / nhiều bé | Sprint 2 |

---

## Audit

- **Secret scan:** pass — không có `ANTHROPIC_API_KEY`, `service_role`, hay key cứng nào trong client bundle
- **Vn-copy:** pass — tất cả copy dùng tiếng Việt ấm áp; lỗi được diễn đạt nhẹ nhàng ("Vui lòng kiểm tra lại" thay vì "Sai")
- **Sprint checklist:** item "Thiết lập Expo + Supabase, đăng ký email, đăng nhập, đăng xuất" → đánh dấu `[x]` sau khi smoke test thực tế

---

## Onboarding Flow (Sprint 1 — item 2)

**Trạng thái:** hoàn thành
**Ngày:** 2026-05-14

### Màn hình onboarding (`app/(onboarding)/`)

| File | Màn hình | Mô tả |
|---|---|---|
| `_layout.tsx` | — | Stack layout cho nhóm onboarding |
| `journey.tsx` | Bước 1/3 | Chọn hành trình: Mang thai / Có em bé / Nhiều bé — 3 card lớn, nút Tiếp tục disabled cho đến khi chọn |
| `survey.tsx` | Bước 2/3 | Thu thập dữ liệu: ngày dự sinh + concern chips (pregnant) hoặc tên bé / ngày sinh / giới tính / cân nặng (has_baby / multiple) |
| `complete.tsx` | Bước 3/3 | Summary cá nhân hóa, feature highlights, nút "Vào app" → ghi Supabase + navigate |

### State & logic

| File | Mô tả |
|---|---|
| `stores/onboardingStore.ts` | Zustand store giữ draft state (journey, dueDate, concerns, babyName, birthDate, gender, birthWeightGrams) qua 3 bước |
| `hooks/useOnboarding.ts` | Submission: insert `baby_profiles` hoặc `pregnancies`, gọi `supabase.auth.updateUser` stamp `onboarding_completed: true`, navigate `/(tabs)/` |

### Files sửa đổi

| File | Thay đổi |
|---|---|
| `types/app.ts` | Thêm `onboardingCompleted: boolean` vào `UserProfile` |
| `stores/authStore.ts` | `mapSupabaseUser` đọc `onboarding_completed` từ user_metadata (default `false`) |
| `app/_layout.tsx` | `NavigationGuard` 3 nhánh: chưa login → login, login chưa onboard → journey, đã onboard → tabs |

### Luồng người dùng (cập nhật)

```
Mở app
  └─ index.tsx → NavigationGuard đọc session
       ├─ [chưa đăng nhập] → /(auth)/login
       └─ [đã đăng nhập]
            ├─ [onboarding_completed = false] → /(onboarding)/journey
            │    ├─ Chọn hành trình → /(onboarding)/survey
            │    └─ Điền thông tin → /(onboarding)/complete
            │         └─ "Vào app" → ghi DB → /(tabs)/
            └─ [onboarding_completed = true] → /(tabs)/
```

### Known limitations

| Hạng mục | Ghi chú |
|---|---|
| `DateField` là stub | Chưa có native date picker — cần `@react-native-community/datetimepicker` ở sprint sau |
| Typo nhỏ | "Ngày dự sinh" có thể mất dấu trong một số string — kiểm tra lại khi tích hợp date picker |
| Multiple journey | Chỉ thu thập 1 bé trong onboarding; bé thứ 2 thêm qua profile management (Sprint 2) |

### Audit

- **Secret scan:** pass — không có key server-side trong client bundle
- **Vn-copy:** pass — tone ấm áp, thuật ngữ nhất quán
