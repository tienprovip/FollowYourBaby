import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// useAIChat
// Client hook for the `ai-chat` Edge Function. Manages a single conversation
// (with optional baby/pregnancy context) and keeps local message state for UI.
//
// All Claude calls happen server-side — we only invoke the Edge Function here.
// ---------------------------------------------------------------------------

export type RiskLevel = 'green' | 'yellow' | 'red';

export interface ChatMessage {
  id: string;             // local UUID (or server id once persisted)
  role: 'user' | 'assistant';
  content: string;
  risk_level?: RiskLevel;
  created_at: string;
}

export interface UseAIChatOptions {
  babyId?: string | null;
  pregnancyId?: string | null;
  initialConversationId?: string | null;
}

interface AIChatResponse {
  conversation_id: string;
  reply: string;
  risk_level: RiskLevel;
  suggestions?: string[];
  error?: string;
}

function uuid(): string {
  // Lightweight client-side id — not cryptographic, only for React keys.
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useAIChat(options: UseAIChatOptions = {}) {
  const { babyId, pregnancyId, initialConversationId = null } = options;

  const [conversationId, setConversationId] = useState<string | null>(initialConversationId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setError(null);
      setIsLoading(true);

      const userMsg: ChatMessage = {
        id: uuid(),
        role: 'user',
        content: trimmed,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const { data, error: invokeError } = await supabase.functions.invoke<AIChatResponse>('ai-chat', {
          body: {
            conversation_id: conversationId,
            message: trimmed,
            baby_id: babyId ?? null,
            pregnancy_id: pregnancyId ?? null,
          },
        });

        if (invokeError) throw new Error(invokeError.message);
        if (!data) throw new Error('Không nhận được phản hồi từ trợ lý.');
        if (data.error) throw new Error(data.error);

        setConversationId(data.conversation_id);
        setSuggestions(data.suggestions ?? []);
        setMessages((prev) => [
          ...prev,
          {
            id: uuid(),
            role: 'assistant',
            content: data.reply,
            risk_level: data.risk_level,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Lỗi không xác định.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, babyId, pregnancyId],
  );

  const resetConversation = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    conversationId,
    messages,
    suggestions,
    isLoading,
    error,
    sendMessage,
    resetConversation,
  };
}
