// ---------------------------------------------------------------------------
// Feed Screen — log breast / bottle / solid feeding sessions
// ---------------------------------------------------------------------------

import React, { useState, useCallback } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { inputStyles } from '@/lib/inputStyles';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useFeedLogs } from '@/hooks/useFeedLogs';
import { useBabyTrackingStore } from '@/stores/babyTrackingStore';
import { useBabyStore } from '@/stores/babyStore';
import { useToast } from '@/components/ui/Toast';
import FeedSessionTimer from '@/components/baby/FeedSessionTimer';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import type { FeedSide } from '@/stores/babyTrackingStore';
import type { Database } from '@/types/database';

type FeedLog = Database['public']['Tables']['feed_logs']['Row'];
type FeedType = 'breast' | 'bottle' | 'solid';

const FEED_SEGMENTS = [
  { key: 'breast', label: 'Bú mẹ' },
  { key: 'bottle', label: 'Bình sữa' },
  { key: 'solid', label: 'Ăn dặm' },
];

const BOTTLE_PRESETS = [30, 60, 90, 120, 150, 180];

const SIDE_OPTIONS: { key: FeedSide; label: string; emoji: string }[] = [
  { key: 'left', label: 'Trái', emoji: '◀' },
  { key: 'right', label: 'Phải', emoji: '▶' },
  { key: 'both', label: 'Hai bên', emoji: '↔' },
];

const FOOD_SUGGESTIONS = [
  'Cháo thịt', 'Cháo cá', 'Rau củ', 'Trái cây', 'Sữa chua', 'Trứng', 'Đậu phụ',
];

function FeedTypeLabel(type: FeedType): string {
  const map: Record<FeedType, string> = {
    breast: 'Bú mẹ',
    bottle: 'Bình sữa',
    solid: 'Ăn dặm',
  };
  return map[type];
}

export default function FeedScreen() {
  const { activeBabyId } = useBabyStore();
  const { logs, isLoading, addFeedLog, isAdding, deleteFeedLog } = useFeedLogs();
  const {
    activeFeedSession,
    setActiveFeedSession,
    clearActiveFeedSession,
  } = useBabyTrackingStore();
  const { show: showToast } = useToast();

  const [feedType, setFeedType] = useState<FeedType>('breast');
  const [side, setSide] = useState<FeedSide>('left');
  const [bottleAmount, setBottleAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [foodItems, setFoodItems] = useState<string[]>([]);
  const [solidNote, setSolidNote] = useState('');
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);

  // ----- Breast session -----

  function startBreastSession() {
    if (!activeBabyId) return;
    setActiveFeedSession({
      babyId: activeBabyId,
      startedAt: new Date(),
      side,
    });
  }

  async function stopBreastSession() {
    if (!activeFeedSession) return;
    try {
      const startedAt = activeFeedSession.startedAt.toISOString();
      const endedAt = new Date().toISOString();
      await addFeedLog({
        type: 'breast',
        started_at: startedAt,
        ended_at: endedAt,
        side: activeFeedSession.side ?? 'both',
        note: note || null,
        amount_ml: null,
        food_items: null,
      });
      clearActiveFeedSession();
      setNote('');
      showToast('Da luu — Hoan tac', 'success', 5000);
    } catch {
      Alert.alert('Loi', 'Khong the luu. Vui long thu lai.');
    }
  }

  // ----- Bottle -----

  async function saveBottle() {
    const ml = bottleAmount ?? parseInt(customAmount, 10);
    if (isNaN(ml) || ml <= 0) {
      Alert.alert('Loi', 'Vui long chon hoac nhap so ml hop le.');
      return;
    }
    try {
      await addFeedLog({
        type: 'bottle',
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
        amount_ml: ml,
        side: null,
        food_items: null,
        note: note || null,
      });
      setBottleAmount(null);
      setCustomAmount('');
      setNote('');
      setShowForm(false);
      showToast('Da luu — Hoan tac', 'success', 5000);
    } catch {
      Alert.alert('Loi', 'Khong the luu. Vui long thu lai.');
    }
  }

  // ----- Solid -----

  function toggleFood(item: string) {
    setFoodItems((prev) =>
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item],
    );
  }

  async function saveSolid() {
    try {
      await addFeedLog({
        type: 'solid',
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
        food_items: foodItems.length > 0 ? foodItems : null,
        amount_ml: null,
        side: null,
        note: solidNote || null,
      });
      setFoodItems([]);
      setSolidNote('');
      setShowForm(false);
      showToast('Da luu — Hoan tac', 'success', 5000);
    } catch {
      Alert.alert('Loi', 'Khong the luu. Vui long thu lai.');
    }
  }

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Xoa ban ghi', 'Ban co chac muon xoa?', [
        { text: 'Huy', style: 'cancel' },
        {
          text: 'Xoa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFeedLog(id);
            } catch {
              Alert.alert('Loi', 'Khong the xoa.');
            }
          },
        },
      ]);
    },
    [deleteFeedLog],
  );

  // ----- Render helpers -----

  function renderBreastForm() {
    if (activeFeedSession) {
      return (
        <Card padding="lg" className="mb-4 items-center">
          <FeedSessionTimer
            startedAt={activeFeedSession.startedAt}
            side={activeFeedSession.side}
          />
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Ghi chu (tuy chon)"
            className="w-full border border-brand-gray rounded-input px-4 py-3 text-brand-navy text-sm mt-4 mb-4"
            placeholderTextColor="#1F2B5B60"
            style={inputStyles.field}
          />
          <Button
            label="Ket thuc bu"
            variant="destructive"
            size="lg"
            className="w-full"
            loading={isAdding}
            onPress={stopBreastSession}
          />
        </Card>
      );
    }

    return (
      <Card padding="lg" className="mb-4">
        <Text className="text-brand-navy font-semibold mb-3">Chon ben bu</Text>
        <View className="flex-row gap-x-3 mb-4">
          {SIDE_OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              onPress={() => setSide(opt.key)}
              className={`flex-1 items-center py-4 rounded-card border-2 ${
                side === opt.key
                  ? 'border-brand-blue bg-brand-blue/10'
                  : 'border-brand-gray bg-white'
              }`}
              accessibilityRole="radio"
              accessibilityState={{ checked: side === opt.key }}
              accessibilityLabel={opt.label}
            >
              <Text style={{ fontSize: 20 }}>{opt.emoji}</Text>
              <Text
                className={`text-xs mt-1 font-semibold ${
                  side === opt.key ? 'text-brand-blue' : 'text-brand-navy/60'
                }`}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Button
          label="Bat dau bu me"
          variant="primary"
          size="lg"
          onPress={startBreastSession}
        />
      </Card>
    );
  }

  function renderBottleForm() {
    if (!showForm) {
      return (
        <Button
          label="+ Ghi binh sua"
          variant="primary"
          size="lg"
          className="mb-4"
          onPress={() => setShowForm(true)}
        />
      );
    }
    return (
      <Card padding="lg" className="mb-4">
        <Text className="text-brand-navy font-semibold mb-3">
          Chon so ml
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {BOTTLE_PRESETS.map((ml) => (
            <Pressable
              key={ml}
              onPress={() => {
                setBottleAmount(ml);
                setCustomAmount('');
              }}
              className={`px-4 py-3 rounded-btn border-2 ${
                bottleAmount === ml
                  ? 'border-brand-blue bg-brand-blue/10'
                  : 'border-brand-gray bg-white'
              }`}
              accessibilityRole="button"
              accessibilityLabel={`${ml} ml`}
            >
              <Text
                className={`font-semibold ${
                  bottleAmount === ml ? 'text-brand-blue' : 'text-brand-navy'
                }`}
              >
                {ml} ml
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          value={customAmount}
          onChangeText={(t) => {
            setCustomAmount(t);
            setBottleAmount(null);
          }}
          placeholder="So ml khac..."
          keyboardType="number-pad"
          className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy text-sm mb-3"
          placeholderTextColor="#1F2B5B60"
          style={inputStyles.field}
        />
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Ghi chu (tuy chon)"
          className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy text-sm mb-4"
          placeholderTextColor="#1F2B5B60"
          style={inputStyles.field}
        />
        <View className="flex-row gap-x-3">
          <Button
            label="Luu"
            variant="primary"
            size="md"
            className="flex-1"
            loading={isAdding}
            onPress={saveBottle}
          />
          <Button
            label="Huy"
            variant="secondary"
            size="md"
            className="flex-1"
            onPress={() => {
              setShowForm(false);
              setBottleAmount(null);
              setCustomAmount('');
              setNote('');
            }}
          />
        </View>
      </Card>
    );
  }

  function renderSolidForm() {
    if (!showForm) {
      return (
        <Button
          label="+ Ghi an dam"
          variant="primary"
          size="lg"
          className="mb-4"
          onPress={() => setShowForm(true)}
        />
      );
    }
    return (
      <Card padding="lg" className="mb-4">
        <Text className="text-brand-navy font-semibold mb-3">
          Mon an hom nay
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-3">
          {FOOD_SUGGESTIONS.map((food) => (
            <Pressable
              key={food}
              onPress={() => toggleFood(food)}
              className={`px-3 py-2 rounded-btn border ${
                foodItems.includes(food)
                  ? 'border-brand-mint bg-brand-mint/20'
                  : 'border-brand-gray bg-white'
              }`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: foodItems.includes(food) }}
              accessibilityLabel={food}
            >
              <Text
                className={`text-sm font-medium ${
                  foodItems.includes(food)
                    ? 'text-brand-navy'
                    : 'text-brand-navy/60'
                }`}
              >
                {food}
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          value={solidNote}
          onChangeText={setSolidNote}
          placeholder="Them mon an khac hoac ghi chu..."
          className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy text-sm mb-4"
          placeholderTextColor="#1F2B5B60"
          style={inputStyles.field}
          multiline
          numberOfLines={2}
        />
        <View className="flex-row gap-x-3">
          <Button
            label="Luu"
            variant="primary"
            size="md"
            className="flex-1"
            loading={isAdding}
            onPress={saveSolid}
          />
          <Button
            label="Huy"
            variant="secondary"
            size="md"
            className="flex-1"
            onPress={() => {
              setShowForm(false);
              setFoodItems([]);
              setSolidNote('');
            }}
          />
        </View>
      </Card>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Bu / An' }} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1 bg-brand-peach"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          {/* Segment */}
          <SegmentedControl
            options={FEED_SEGMENTS}
            selectedKey={feedType}
            onChange={(k) => {
              setFeedType(k as FeedType);
              setShowForm(false);
            }}
            className="mb-4"
          />

          {/* Form per type */}
          {feedType === 'breast' && renderBreastForm()}
          {feedType === 'bottle' && renderBottleForm()}
          {feedType === 'solid' && renderSolidForm()}

          {/* History */}
          <Text className="text-brand-navy font-semibold mb-2">Lich su 7 ngay</Text>
          {isLoading ? (
            <LoadingSpinner />
          ) : logs.length === 0 ? (
            <EmptyState
              title="Chua co ban ghi"
              body="Ghi lan bu dau tien cho be"
            />
          ) : (
            logs
              .filter((l) => l.type === feedType)
              .map((log) => (
                <FeedLogRow
                  key={log.id}
                  log={log}
                  onDelete={() => handleDelete(log.id)}
                />
              ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

// ---------------------------------------------------------------------------
// FeedLogRow component
// ---------------------------------------------------------------------------

function FeedLogRow({
  log,
  onDelete,
}: {
  log: FeedLog;
  onDelete: () => void;
}) {
  const startTime = format(parseISO(log.started_at), 'HH:mm, dd/MM', {
    locale: vi,
  });

  let detail = '';
  if (log.type === 'breast') {
    const sideMap: Record<string, string> = {
      left: 'Ben trai',
      right: 'Ben phai',
      both: 'Hai ben',
    };
    detail = sideMap[log.side ?? ''] ?? '';
  } else if (log.type === 'bottle') {
    detail = `${log.amount_ml ?? '?'} ml`;
  } else if (log.type === 'solid') {
    detail = log.food_items?.join(', ') ?? '';
  }

  return (
    <Card padding="sm" className="mb-2">
      <View className="flex-row items-center">
        <View className="flex-1">
          <Text className="text-brand-navy font-semibold text-sm">
            {FeedTypeLabel(log.type as FeedType)}
          </Text>
          {detail !== '' && (
            <Text className="text-brand-navy/70 text-xs">{detail}</Text>
          )}
          <Text className="text-brand-navy/50 text-xs mt-0.5">{startTime}</Text>
          {log.note && (
            <Text className="text-brand-navy/50 text-xs">{log.note}</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={onDelete}
          className="p-2"
          accessibilityLabel="Xoa ban ghi"
        >
          <Text className="text-red-400 text-sm">Xoa</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
