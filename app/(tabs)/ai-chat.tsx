import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AIDisclaimer from '@/components/ui/AIDisclaimer';
import ChatBubble from '@/components/ai/ChatBubble';
import TypingIndicator from '@/components/ai/TypingIndicator';
import { PremiumGate } from '@/components/paywall/PremiumGate';
import { useAIChat, type ChatMessage } from '@/hooks/useAIChat';
import { useSubscription } from '@/hooks/useSubscription';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useBabyStore } from '@/stores/babyStore';
import { useAuthStore } from '@/stores/authStore';
import { useBabies } from '@/hooks/useBabies';
import { usePregnancies } from '@/hooks/usePregnancies';
import { FREE_AI_MESSAGES_PER_DAY } from '@/hooks/useSubscription';

type ContextMode = 'baby' | 'pregnancy' | 'general';

interface SuggestionChipProps {
  label: string;
  onPress: () => void;
}

function SuggestionChip({ label, onPress }: SuggestionChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="bg-brand-lavender-50 border border-brand-lavender-200 rounded-full px-4 py-2 mr-2 active:opacity-70"
    >
      <Text className="text-brand-lavender-700 text-xs font-medium">{label}</Text>
    </Pressable>
  );
}

interface ContextTabProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function ContextTab({ label, active, onPress }: ContextTabProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      className={`px-4 py-2 rounded-full mr-2 ${active ? 'bg-brand-pink' : 'bg-brand-gray'}`}
    >
      <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-brand-navy/60'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

const PREGNANCY_CHIPS = [
  'Tuần này con phát triển ra sao?',
  'Triệu chứng này có bình thường không?',
  'Nên ăn gì tuần này?',
  'Khi nào cần đi khám?',
];

const BABY_CHIPS = [
  'Hôm nay bé có gì khác?',
  'Bé bú đủ chưa?',
  'Mẹo cho bé ngủ ngon',
  'Bé phát triển đúng chuẩn chưa?',
];

const GENERAL_CHIPS = [
  'Hỏi về dinh dưỡng',
  'Hỏi về giấc ngủ',
  'Tóm tắt hôm nay',
  'Gợi ý chăm sóc',
];

export default function AIChatScreen() {
  const { activeBabyId, activePregnancyId } = useBabyStore();
  const user = useAuthStore((s) => s.user);
  const { babies } = useBabies();
  const { pregnancies } = usePregnancies();
  const { canUseAI, isPremium, aiMessagesUsedToday, aiMessagesLeft } = useSubscription();
  const { incrementAIUsage } = useSubscriptionStore();

  const hasPregnancy = Boolean(activePregnancyId || pregnancies.length > 0);
  const hasBaby = Boolean(activeBabyId || babies.length > 0);

  const resolvedBabyId = activeBabyId ?? babies[0]?.id ?? null;
  const resolvedPregnancyId = activePregnancyId ?? pregnancies[0]?.id ?? null;

  const defaultMode: ContextMode = hasPregnancy ? 'pregnancy' : hasBaby ? 'baby' : 'general';
  const [contextMode, setContextMode] = useState<ContextMode>(defaultMode);

  const effectiveBabyId = contextMode === 'baby' ? resolvedBabyId : null;
  const effectivePregnancyId = contextMode === 'pregnancy' ? resolvedPregnancyId : null;

  const { messages, suggestions, isLoading, error, sendMessage, resetConversation } = useAIChat({
    babyId: effectiveBabyId,
    pregnancyId: effectivePregnancyId,
  });

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const chips =
    contextMode === 'pregnancy'
      ? PREGNANCY_CHIPS
      : contextMode === 'baby'
      ? BABY_CHIPS
      : GENERAL_CHIPS;

  const activeChips = suggestions.length > 0 ? suggestions : chips;

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;
    // Gate: free users are limited to FREE_AI_MESSAGES_PER_DAY messages/day.
    // canUseAI already reflects today's count, but we recheck here before
    // dispatching so the UI state stays consistent even if the hook value
    // hasn't re-rendered yet.
    if (!canUseAI) return;
    setInputText('');
    if (!isPremium) {
      await incrementAIUsage();
    }
    await sendMessage(text);
  }, [inputText, isLoading, canUseAI, isPremium, incrementAIUsage, sendMessage]);

  const handleChipPress = useCallback(
    async (chip: string) => {
      if (!canUseAI) return;
      if (!isPremium) {
        await incrementAIUsage();
      }
      await sendMessage(chip);
    },
    [canUseAI, isPremium, incrementAIUsage, sendMessage],
  );

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isLoading]);

  useEffect(() => {
    resetConversation();
  }, [contextMode, resetConversation]);

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <ChatBubble message={item} isUser={item.role === 'user'} />
    ),
    [],
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  const greetingName = user?.displayName?.split(' ').pop() ?? 'bạn';

  return (
    <SafeAreaView className="flex-1 bg-brand-peach" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <View className="px-4 pt-4 pb-2">
          <Text className="text-brand-navy text-xl font-bold">Trợ lý AI</Text>
          <Text className="text-brand-navy/50 text-sm mt-0.5">Hỏi bất cứ điều gì, {greetingName} nhé</Text>
        </View>

        <View className="px-4 mb-2">
          <AIDisclaimer />
        </View>

        {(hasPregnancy || hasBaby) && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
          >
            {hasBaby && (
              <ContextTab
                label="Bé"
                active={contextMode === 'baby'}
                onPress={() => setContextMode('baby')}
              />
            )}
            {hasPregnancy && (
              <ContextTab
                label="Thai kỳ"
                active={contextMode === 'pregnancy'}
                onPress={() => setContextMode('pregnancy')}
              />
            )}
            <ContextTab
              label="Chung"
              active={contextMode === 'general'}
              onPress={() => setContextMode('general')}
            />
          </ScrollView>
        )}

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-8 py-16">
              <Text className="text-5xl mb-4">💬</Text>
              <Text className="text-brand-navy font-semibold text-base text-center mb-2">
                Chào {greetingName}!
              </Text>
              <Text className="text-brand-navy/50 text-sm text-center leading-6">
                Hãy hỏi tôi bất cứ điều gì về sức khỏe và chăm sóc. Tôi ở đây để giúp bạn.
              </Text>
            </View>
          }
          ListFooterComponent={isLoading ? <TypingIndicator /> : null}
        />

        {error && (
          <View className="mx-4 mb-2 bg-red-50 border border-red-200 rounded-input px-3 py-2">
            <Text className="text-red-600 text-xs">Không thể kết nối AI. Thử lại sau.</Text>
          </View>
        )}

        {/* Free-tier quota banner — shown when quota is running low or exhausted */}
        {!isPremium && aiMessagesUsedToday > 0 && (
          <View style={[
            styles.quotaBanner,
            aiMessagesLeft === 0 ? styles.quotaBannerExhausted : styles.quotaBannerWarning,
          ]}>
            <Text style={[
              styles.quotaBannerText,
              aiMessagesLeft === 0 ? styles.quotaBannerTextExhausted : styles.quotaBannerTextWarning,
            ]}>
              {aiMessagesLeft === 0
                ? `Bạn đã dùng hết ${FREE_AI_MESSAGES_PER_DAY} tin nhắn AI hôm nay. Nâng cấp Premium để dùng không giới hạn.`
                : `Còn ${aiMessagesLeft}/${FREE_AI_MESSAGES_PER_DAY} tin nhắn AI hôm nay`}
            </Text>
          </View>
        )}

        {/* When quota is exhausted show PremiumGate in place of the input row */}
        {!canUseAI ? (
          <PremiumGate feature="ai_chat" />
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
              keyboardShouldPersistTaps="always"
            >
              {activeChips.slice(0, 4).map((chip) => (
                <SuggestionChip key={chip} label={chip} onPress={() => handleChipPress(chip)} />
              ))}
            </ScrollView>

            <View className="flex-row items-end px-4 pb-4 gap-2">
              <View className="flex-1 bg-white border border-brand-pink-200 rounded-input px-4 py-3 min-h-[44px] max-h-[120px] justify-center">
                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Nhập câu hỏi của bạn..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  style={styles.input}
                  returnKeyType="send"
                  onSubmitEditing={handleSend}
                  editable={!isLoading}
                  accessibilityLabel="Nhập tin nhắn"
                />
              </View>
              <Pressable
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading}
                accessibilityRole="button"
                accessibilityLabel="Gửi tin nhắn"
                style={({ pressed }) => [
                  styles.sendButton,
                  (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
                  pressed && styles.sendButtonPressed,
                ]}
              >
                <Text style={styles.sendIcon}>↑</Text>
              </Pressable>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 4,
  },
  input: {
    color: '#1F2B5B',
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
    margin: 0,
  },
  quotaBanner: {
    marginHorizontal: 16,
    marginBottom: 6,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quotaBannerWarning: {
    backgroundColor: '#FFF3EC',
    borderWidth: 1,
    borderColor: '#FF8FA860',
  },
  quotaBannerExhausted: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  quotaBannerText: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
  quotaBannerTextWarning: {
    color: '#FF6B8A',
  },
  quotaBannerTextExhausted: {
    color: '#EF4444',
    fontWeight: '600',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF8FA8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
  sendButtonPressed: {
    backgroundColor: '#E84E70',
  },
  sendIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
});
