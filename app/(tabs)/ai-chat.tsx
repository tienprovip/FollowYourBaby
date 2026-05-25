import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AIDisclaimer from '@/components/ui/AIDisclaimer';
import ChatBubble from '@/components/ai/ChatBubble';
import TypingIndicator from '@/components/ai/TypingIndicator';
import { useAIChat, type ChatMessage } from '@/hooks/useAIChat';
import { FREE_AI_MESSAGES_PER_DAY, useSubscription } from '@/hooks/useSubscription';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useBabyStore } from '@/stores/babyStore';
import { useAuthStore } from '@/stores/authStore';
import { useBabies } from '@/hooks/useBabies';
import { usePregnancies } from '@/hooks/usePregnancies';

type ContextMode = 'baby' | 'pregnancy' | 'general';

const CONTEXT_META: Record<ContextMode, { label: string; shortLabel: string; eyebrow: string }> = {
  baby: {
    label: 'Hồ sơ bé',
    shortLabel: 'Bé',
    eyebrow: 'Chăm sóc bé',
  },
  pregnancy: {
    label: 'Thai kỳ',
    shortLabel: 'Thai kỳ',
    eyebrow: 'Mẹ bầu',
  },
  general: {
    label: 'Tư vấn chung',
    shortLabel: 'Chung',
    eyebrow: 'Hỏi nhanh',
  },
};

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

const GENERAL_CHIPS = ['Hỏi về dinh dưỡng', 'Hỏi về giấc ngủ', 'Tóm tắt hôm nay', 'Gợi ý chăm sóc'];

interface SuggestionChipProps {
  disabled?: boolean;
  label: string;
  onPress: () => void;
}

function SuggestionChip({ disabled = false, label, onPress }: SuggestionChipProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className="mr-2 rounded-full border border-brand-lavender-200 bg-white px-3 py-2 active:opacity-70"
      style={disabled ? styles.disabledSurface : undefined}
    >
      <Text className="text-xs font-semibold leading-4 text-brand-navy">{label}</Text>
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
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className={`h-9 flex-1 items-center justify-center rounded-xl ${
        active ? 'bg-white' : 'bg-transparent'
      }`}
    >
      <Text
        className={`text-xs font-bold ${active ? 'text-brand-pink-600' : 'text-brand-navy/55'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

interface ContextTabsProps {
  activeMode: ContextMode;
  onChange: (mode: ContextMode) => void;
  options: ContextMode[];
}

function ContextTabs({ activeMode, onChange, options }: ContextTabsProps) {
  if (options.length <= 1) return null;

  return (
    <View className="mx-4 mb-2 rounded-input border border-brand-gray bg-white/60 p-1">
      <View className="flex-row gap-1">
        {options.map((mode) => (
          <ContextTab
            key={mode}
            label={CONTEXT_META[mode].label}
            active={activeMode === mode}
            onPress={() => onChange(mode)}
          />
        ))}
      </View>
    </View>
  );
}

function QuotaLimitPanel() {
  return (
    <View className="mx-4 mb-3 rounded-card border border-brand-pink-100 bg-white px-4 py-4">
      <Text className="text-sm font-bold text-brand-navy">Hết lượt hỏi AI hôm nay</Text>
      <Text className="mt-1 text-xs leading-5 text-brand-navy/60">
        Bạn đã dùng hết {FREE_AI_MESSAGES_PER_DAY} tin nhắn miễn phí. Mai mình lại tiếp tục, hoặc
        nâng cấp để hỏi không giới hạn.
      </Text>
      <Pressable
        onPress={() => router.push('/paywall')}
        accessibilityRole="button"
        accessibilityLabel="Nâng cấp Premium"
        className="mt-3 self-start rounded-btn bg-brand-pink px-4 py-2 active:opacity-80"
      >
        <Text className="text-xs font-bold text-white">Nâng cấp Premium</Text>
      </Pressable>
    </View>
  );
}

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

  const contextOptions = useMemo<ContextMode[]>(() => {
    const options: ContextMode[] = [];
    if (hasBaby) options.push('baby');
    if (hasPregnancy) options.push('pregnancy');
    options.push('general');
    return options;
  }, [hasBaby, hasPregnancy]);

  const babyChat = useAIChat({ babyId: resolvedBabyId });
  const pregnancyChat = useAIChat({ pregnancyId: resolvedPregnancyId });
  const generalChat = useAIChat({});

  const { messages, suggestions, isLoading, error, sendMessage } =
    contextMode === 'baby' ? babyChat : contextMode === 'pregnancy' ? pregnancyChat : generalChat;

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const chips =
    contextMode === 'pregnancy'
      ? PREGNANCY_CHIPS
      : contextMode === 'baby'
        ? BABY_CHIPS
        : GENERAL_CHIPS;

  const activeChips = suggestions.length > 0 ? suggestions : chips;
  const currentContext = CONTEXT_META[contextMode];
  const greetingName = user?.displayName?.split(' ').pop() ?? 'bạn';

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isLoading || !canUseAI) return;

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

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <ChatBubble message={item} isUser={item.role === 'user'} />
    ),
    [],
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  const sendDisabled = !inputText.trim() || isLoading || !canUseAI;

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8F5]" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <View className="px-4 pt-4 pb-3">
          <View className="rounded-card border border-brand-gray bg-white px-4 pt-4 pb-3 shadow-brand">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xs font-bold uppercase tracking-wide text-brand-lavender-700">
                  {currentContext.eyebrow}
                </Text>
                <Text className="mt-1 text-2xl font-bold text-brand-navy">Trợ lý AI</Text>
                <Text className="mt-1 text-sm leading-5 text-brand-navy/60">
                  Hỏi về sức khỏe, chăm sóc và lịch sinh hoạt của mẹ và bé.
                </Text>
              </View>
              <View className="rounded-2xl border border-brand-lavender-200 bg-brand-lavender-50 px-3 py-2">
                <Text className="text-xs font-semibold text-brand-lavender-700">
                  {currentContext.shortLabel}
                </Text>
              </View>
            </View>
            {!isPremium && (
              <View className="mt-3 rounded-2xl bg-brand-peach px-3 py-2">
                <Text className="text-xs font-medium text-brand-navy/70">
                  {aiMessagesLeft > 0
                    ? `Còn ${aiMessagesLeft}/${FREE_AI_MESSAGES_PER_DAY} tin nhắn AI hôm nay`
                    : 'Đã hết tin nhắn AI miễn phí hôm nay'}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="px-4 mb-2">
          <AIDisclaimer />
        </View>

        <ContextTabs options={contextOptions} activeMode={contextMode} onChange={setContextMode} />

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 justify-center px-4 pb-12">
              <View className="rounded-card border border-brand-gray bg-white px-5 py-6 shadow-brand">
                <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl border border-brand-lavender-200 bg-brand-lavender-50">
                  <Text className="text-lg font-bold text-brand-lavender-700">AI</Text>
                </View>
                <Text className="mb-2 text-lg font-bold text-brand-navy">Chào {greetingName}</Text>
                <Text className="text-sm leading-6 text-brand-navy/60">
                  Chọn một gợi ý bên dưới hoặc nhập điều bạn đang băn khoăn. AI sẽ trả lời theo ngữ
                  cảnh đang chọn và luôn kèm mức độ cần theo dõi.
                </Text>
              </View>
              <Text className="mt-4 text-center text-xs leading-5 text-brand-navy/45">
                Với dấu hiệu bất thường hoặc cấp cứu, hãy liên hệ bác sĩ hoặc cơ sở y tế ngay.
              </Text>
            </View>
          }
          ListFooterComponent={isLoading ? <TypingIndicator /> : null}
        />

        {error && (
          <View className="mx-4 mb-2 rounded-input border border-red-200 bg-red-50 px-3 py-2">
            <Text className="text-xs text-red-600">
              Có chút trục trặc khi kết nối AI. Thử lại sau ít phút nhé.
            </Text>
          </View>
        )}

        {!isPremium && aiMessagesUsedToday > 0 && aiMessagesLeft > 0 && (
          <View style={styles.quotaBanner}>
            <Text style={styles.quotaBannerText}>
              Còn {aiMessagesLeft}/{FREE_AI_MESSAGES_PER_DAY} tin nhắn AI hôm nay
            </Text>
          </View>
        )}

        {!canUseAI && <QuotaLimitPanel />}

        <View className="border-t border-brand-gray/70 bg-white px-4 pt-2 pb-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionContent}
            keyboardShouldPersistTaps="always"
          >
            {activeChips.slice(0, 4).map((chip) => (
              <SuggestionChip
                key={chip}
                disabled={!canUseAI}
                label={chip}
                onPress={() => handleChipPress(chip)}
              />
            ))}
          </ScrollView>

          <View style={[styles.composerCard, !canUseAI && styles.disabledComposerCard]}>
            <View style={styles.inputShell}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder={canUseAI ? 'Nhập câu hỏi của bạn...' : 'Đã hết lượt hỏi AI hôm nay'}
                placeholderTextColor="#A0A3B1"
                multiline
                style={styles.input}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                editable={!isLoading && canUseAI}
                accessibilityLabel="Nhập tin nhắn"
              />
            </View>
            <Pressable
              onPress={handleSend}
              accessibilityRole="button"
              accessibilityLabel="Gửi tin nhắn"
              accessibilityState={{ disabled: sendDisabled }}
              style={[
                styles.sendButton,
                sendDisabled && styles.sendButtonDisabled,
              ]}
            >
              <Text style={[styles.sendText, sendDisabled && styles.sendTextDisabled]}>Gửi</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  disabledSurface: {
    opacity: 0.45,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 4,
  },
  suggestionContent: {
    paddingBottom: 8,
    minHeight: 42,
  },
  input: {
    color: '#1F2B5B',
    fontSize: 15,
    lineHeight: 20,
    padding: 0,
    margin: 0,
  },
  composerCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#F7DDE5',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 52,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    width: '100%',
  },
  disabledComposerCard: {
    backgroundColor: '#FAFAFA',
    borderColor: '#F3E6EA',
  },
  inputShell: {
    flex: 1,
    minHeight: 36,
    maxHeight: 112,
    justifyContent: 'center',
    paddingRight: 8,
  },
  quotaBanner: {
    marginHorizontal: 16,
    marginBottom: 6,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF8F5',
    borderWidth: 1,
    borderColor: '#FFD9E3',
  },
  quotaBannerText: {
    color: '#FF6B8A',
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
  sendButton: {
    width: 64,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#FF8FA8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    shadowColor: '#FF8FA8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#FFD9E3',
    elevation: 0,
    shadowOpacity: 0,
  },
  sendText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  sendTextDisabled: {
    color: '#A01E42',
  },
});
