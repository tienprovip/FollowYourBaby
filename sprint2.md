# Sprint 2 — Quản lý profile, nhiều bé/thai kỳ, và chia sẻ quyền chăm sóc

## Tổng quan

Sprint 2 xây dựng hoàn chỉnh hai tính năng cốt lõi:
1. **Quản lý hồ sơ** — chỉnh sửa thông tin cá nhân, thêm/sửa/xóa nhiều bé, quản lý nhiều thai kỳ, chuyển đổi context bé/thai kỳ đang active.
2. **Chia sẻ quyền chăm sóc** — mời người thân/người chăm sóc với 3 mức quyền (xem / chỉnh sửa / toàn quyền), chấp nhận lời mời qua deep link, thu hồi quyền truy cập.

---

## Các file được tạo mới

### Migration

| File | Mục đích |
|---|---|
| `supabase/migrations/0006_care_share_invites.sql` | Bảng `care_share_invites` (token, expires_at, invitee_email) + RLS + stored function `accept_care_share_invite()` |

### Edge Function (Server-side)

| File | Mục đích |
|---|---|
| `supabase/functions/create-care-invite/index.ts` | Tạo care_share row + generate invite token an toàn phía server |

### Stores

| File | Thay đổi |
|---|---|
| `stores/babyStore.ts` | Viết lại — `activeBabyId`, `activePregnancyId` với AsyncStorage persistence và `hydrate()` để restore khi mở app |

### Hooks

| File | Chức năng |
|---|---|
| `hooks/useProfile.ts` | Fetch + update profile của user hiện tại (TanStack Query) |
| `hooks/useBabies.ts` | List, thêm, sửa, xóa babies; `setActive()` để switch context |
| `hooks/usePregnancies.ts` | List, thêm, sửa, archive pregnancies; `setActive()` để switch context |
| `hooks/useCareShares.ts` | Shares tôi đã grant, shares được grant cho tôi, tạo invite, accept invite, revoke share |

### Screens

| File | Mô tả |
|---|---|
| `app/(profile)/_layout.tsx` | Stack layout cho profile group |
| `app/(profile)/index.tsx` | Chỉnh sửa hồ sơ: full_name, phone, hiển thị vai trò, đăng xuất |
| `app/(profile)/babies.tsx` | Danh sách bé — tap để set active, nút thêm bé mới |
| `app/(profile)/baby-form.tsx` | Form thêm/sửa bé: tên, ngày sinh, giới tính, cân nặng sơ sinh, chiều cao |
| `app/(profile)/pregnancies.tsx` | Danh sách thai kỳ — tap để set active, nút thêm thai kỳ |
| `app/(profile)/pregnancy-form.tsx` | Form thêm/sửa/archive thai kỳ: ngày dự sinh, ngày kinh cuối |
| `app/(profile)/care-sharing.tsx` | Tổng quan chia sẻ — bảng người được share + bảng được share với tôi |
| `app/(profile)/invite.tsx` | Form mời người: chọn resource, chọn permission, nhập email |
| `app/invite/[token].tsx` | Deep link screen — chấp nhận lời mời khi mở `followyourbaby://invite/<token>` |

### Screens đã chỉnh sửa

| File | Thay đổi |
|---|---|
| `app/(tabs)/_layout.tsx` | Thêm tab Profile |
| `app/(tabs)/profile.tsx` | Tab Profile hub — link đến các mục con của `(profile)/` |
| `app/_layout.tsx` | Thêm deep link handler cho `followyourbaby://invite/:token` + `babyStore.hydrate()` khi app mount |

---

## Kiến trúc kỹ thuật

### Care sharing flow

```
Chủ sở hữu                 Edge Function (server)         Người được mời
─────────────────────────────────────────────────────────────────────────
[Nhập email + permission]
         │
         ▼
   useCareShares.inviteCaregiver()
         │
         ▼
   supabase.functions.invoke('create-care-invite')
         │
         ├─ Verify ownership (RLS via user JWT)
         ├─ Upsert care_shares row
         ├─ Insert care_share_invites (token = gen_random_bytes(24))
         └─ STUB: gửi email deeplink followyourbaby://invite/<token>
                                                        │
                                                        ▼
                                              Mở deep link → app/invite/[token].tsx
                                                        │
                                                        ▼
                                              supabase.rpc('accept_care_share_invite', { p_token })
                                              (SECURITY DEFINER function — validate token, expiry, idempotency)
```

### Active context persistence

`babyStore.ts` dùng AsyncStorage để lưu `activeBabyId` và `activePregnancyId`. Khi app mount, `hydrate()` được gọi trong `app/_layout.tsx` để restore context từ lần dùng trước. Các module tracking (Sprint 3+) sẽ đọc từ store này thay vì tự quản lý state.

### RLS pattern cho care shares

Các bảng tracking (feed_logs, sleep_logs, v.v.) cần sử dụng helper function `has_resource_access(resource_type, resource_id, required_permission)` để kiểm tra quyền. Pattern này đã được thiết lập trong schema gốc (`0002_rls.sql`).

---

## Security — Những điểm quan trọng

### care_share_invites RLS
- **Owner insert/select/delete**: chỉ chủ sở hữu của resource mới có quyền tạo/xem/xóa invite — kiểm tra qua join `care_shares → babies/pregnancies`.
- **Accept qua SECURITY DEFINER function**: không có `UPDATE` policy trực tiếp trên bảng. Người dùng chỉ có thể accept thông qua `accept_care_share_invite(p_token)` — function này validate token, expiry, idempotency nội bộ rồi mới update.

### Edge Function `create-care-invite`
- Dùng user JWT client để verify ownership (RLS enforced).
- Dùng service_role client chỉ cho insert invite token — `SUPABASE_SERVICE_ROLE_KEY` chỉ tồn tại trong Deno.env, không bao giờ bundled vào client.

### Secret scan: PASS
Không có `ANTHROPIC_API_KEY`, `service_role`, hay `service_role_key` trong bất kỳ file client nào (`app/`, `hooks/`, `stores/`).

---

## Dependencies mới

| Package | Lý do |
|---|---|
| `@react-native-async-storage/async-storage` | Persist activeBabyId / activePregnancyId qua app restart |
| `@hookform/resolvers` | `zodResolver` cho form validation trong profile/baby/pregnancy forms |

---

## TODO để hoàn thiện trước production

- [ ] **Email/SMS gửi invite**: Edge Function `create-care-invite` hiện có STUB log. Cần tích hợp nhà cung cấp (Resend, Twilio) để gửi deep link thật.
- [ ] **Avatar upload**: `app/(profile)/index.tsx` hiển thị avatar nhưng chưa có image picker / Supabase Storage upload.
- [ ] **Lookup grantee trước khi tạo share**: Hiện tại grantee_id trên `care_shares` dùng owner làm placeholder; cần lookup email → profile_id khi accept.
- [ ] **Notification khi được mời**: Người được mời nên nhận push notification ngoài email.

---

## Sprint checklist cần cập nhật trong CLAUDE.md

```
- [x] Sprint 2: Quản lý profile người dùng, nhiều bé, nhiều thai kỳ
- [x] Sprint 2: Chia sẻ quyền chăm sóc và phân quyền
```

Sau khi smoke test, cập nhật hai dòng trên trong `CLAUDE.md`.
