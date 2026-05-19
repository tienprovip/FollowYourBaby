# Sprint 7 — AI Chat UI Integration

## Summary

Sprint 7 wires the AI backend (Edge Functions from Sprint 6) into a full user-facing chat and summary experience. The AI chat tab is now a functional conversational interface, the dashboard shows a daily AI digest, and all AI output carries the mandatory disclaimer and risk badge.

## Files Created

- `components/ai/ChatBubble.tsx` — User/assistant message bubble. User messages: right-aligned, brand-pink-100 background. Assistant messages: left-aligned, white background with shadow. Displays RiskBadge for yellow/red risk levels. Yellow shows "Theo dõi thêm"; red shows "Nên liên hệ bác sĩ sớm."
- `components/ai/TypingIndicator.tsx` — Three-dot animated typing indicator using react-native Animated loop on native driver. Appears as an assistant bubble while isLoading is true.
- `components/ai/DailySummaryCard.tsx` — Collapsible card for the AI daily summary. Uses useAIDailySummary hook, shows loading skeleton, inline retry on error, highlights and action items when expanded.

## Files Modified

- `app/(tabs)/ai-chat.tsx` — Full AI chat screen replacing the stub. Features: AIDisclaimer at top, context tabs (Bé / Thai kỳ / Chung), FlatList of ChatBubble, TypingIndicator while loading, suggestion chips (preset per context mode, replaced by AI-returned suggestions after first message), multi-line TextInput with send button, inline error banner on Edge Function failure, auto-scroll on new messages, conversation reset when context mode changes.
- `app/(tabs)/index.tsx` — Dashboard home screen replacing the Sprint-1 stub. Features: time-based greeting with user first name, DailySummaryCard (babyId + pregnancyId resolved from store), four quick-action cards (Theo dõi bé, Chat AI, Mốc phát triển, Kiến thức).

## Prompt-chip presets wired per journey

| Context mode | Chips |
|---|---|
| Baby (Bé) | Hôm nay bé có gì khác?, Bé bú đủ chưa?, Mẹo cho bé ngủ ngon, Bé phát triển đúng chuẩn chưa? |
| Pregnancy (Thai kỳ) | Tuần này con phát triển ra sao?, Triệu chứng này có bình thường không?, Nên ăn gì tuần này?, Khi nào cần đi khám? |
| General (Chung) | Hỏi về dinh dưỡng, Hỏi về giấc ngủ, Tóm tắt hôm nay, Gợi ý chăm sóc |

After the first exchange, the AI-returned `suggestions` array replaces the preset chips (up to 4 shown).

## Architecture notes

- No streaming: `useAIChat` uses `supabase.functions.invoke` (JSON response). The typing indicator provides the streaming feel while the request is in flight.
- Context detection: the chat screen reads `activeBabyId`/`activePregnancyId` from `useBabyStore`, falls back to the first item from `useBabies`/`usePregnancies`. Context tabs only render when the user has at least one resource of that type.
- Conversation resets (via `resetConversation`) whenever the context tab changes, keeping context clean.
- Error fallback: inline red banner "Không thể kết nối AI. Thử lại sau." — the user's typed text is not lost (state cleared only on successful send).

## Known limitations / TODOs

- Markdown rendering: assistant responses are rendered as plain Text. `react-native-markdown-display` is not in the current dependency list; adding it would require `npm install` and a separate pass.
- The `DailySummaryCard` on the home screen only fetches if `babyId` or `pregnancyId` is non-null. Users with no profiles yet see no card (correct behaviour — avoids a useless Edge Function call).
- Red risk level: "Liên hệ bác sĩ" CTA currently shows inline text only. A full nearby-facility list sheet is listed as a future TODO.
- Memory prompt ("Bạn có muốn AI nhớ điều này?") post-conversation is not yet implemented; requires an `ai_memory` table migration.
- Streaming via SSE/EventSource is not wired — the hook design supports it but the current Edge Function returns JSON. When the Edge Function supports SSE, `sendMessage` in `useAIChat` would be updated to use `fetch` with `ReadableStream` without changing any component code.
