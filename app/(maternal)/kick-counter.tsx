import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { useActivePregnancy } from '@/hooks/usePregnancy';
import { useKickCounts, KICK_RISK_THRESHOLD, KICK_SESSION_DURATION_HOURS } from '@/hooks/useKickCounts';
import { useMaternalStore } from '@/stores/maternalStore';
import KickButton from '@/components/maternal/KickButton';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import RiskBadge from '@/components/ui/RiskBadge';
import AIDisclaimer from '@/components/ui/AIDisclaimer';
import { format, parseISO } from 'date-fns';

// ---------------------------------------------------------------------------
// Kick Counter Screen
// ---------------------------------------------------------------------------

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatSessionLabel(count: number, startedAt: string, endedAt: string | null): string {
  if (!endedAt) return `${count} cú đạp (đang chạy)`;
  const durationMs = new Date(endedAt).getTime() - new Date(startedAt).getTime();
  const totalMinutes = Math.max(0, Math.floor(durationMs / 60000));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const durationStr = h > 0 ? `${h} tiếng ${m} phút` : `${m} phút`;
  return `${count} cú đạp trong ${durationStr}`;
}

export default function KickCounterScreen() {
  const { pregnancy } = useActivePregnancy();
  const { sessions, todayKickCount, isLoading, startSession, endSession, cancelSession, deleteSession, isStarting, isEnding, isSessionLowKick } =
    useKickCounts(pregnancy?.id ?? null);

  const activeSession = useMaternalStore((s) => s.activeKickSession);
  const { incrementKick, endKickSession } = useMaternalStore();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start/stop timer
  useEffect(() => {
    if (activeSession?.isRunning) {
      const startTime = activeSession.startedAt.getTime();
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSession?.isRunning, activeSession?.startedAt]);

  const handleStart = useCallback(async () => {
    if (!pregnancy?.id) {
      Alert.alert('Lỗi', 'Không tìm thấy thai kỳ. Vui lòng thử lại.');
      return;
    }
    try {
      await startSession();
    } catch {
      Alert.alert('Lỗi', 'Không thể bắt đầu phiên đếm. Vui lòng thử lại.');
    }
  }, [pregnancy?.id, startSession]);

  const handleKick = useCallback(() => {
    incrementKick();
  }, [incrementKick]);

  const handleSave = useCallback(async () => {
    if (!activeSession) return;
    endKickSession();
    try {
      const saved = await endSession({
        sessionId: activeSession.sessionId,
        count: activeSession.count,
      });

      // Risk check: < 10 kicks in <= 2h
      const durationHours = elapsedSeconds / 3600;
      if (durationHours <= KICK_SESSION_DURATION_HOURS && activeSession.count < KICK_RISK_THRESHOLD) {
        Alert.alert(
          'Chú ý — Thai máy ít',
          `Chỉ ghi nhận ${activeSession.count} cú đạp trong ${Math.round(durationHours * 60)} phút. Nếu thai máy giảm nhiều lần liên tiếp, hãy liên hệ bác sĩ.`,
          [{ text: 'Đã hiểu' }],
        );
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu phiên. Vui lòng thử lại.');
    }
    setElapsedSeconds(0);
  }, [activeSession, endSession, endKickSession, elapsedSeconds]);

  const handleCancel = useCallback(async () => {
    if (!activeSession) return;
    Alert.alert('Huỷ phiên', 'Dữ liệu phiên này sẽ bị xoá. Bạn có chắc?', [
      { text: 'Không', style: 'cancel' },
      {
        text: 'Huỷ phiên',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelSession(activeSession.sessionId);
          } catch {
            // Session might already be gone
          }
          setElapsedSeconds(0);
        },
      },
    ]);
  }, [activeSession, cancelSession]);

  const handleDelete = useCallback((sessionId: string, label: string) => {
    Alert.alert('Xoá lịch sử', `Xoá phiên "${label}"?`, [
      { text: 'Không', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSession(sessionId);
          } catch {
            Alert.alert('Lỗi', 'Không thể xoá phiên. Vui lòng thử lại.');
          }
        },
      },
    ]);
  }, [deleteSession]);

  const isRunning = activeSession?.isRunning ?? false;
  const currentCount = activeSession?.count ?? 0;

  // Warn if approaching 2h with low count
  const sessionRisk =
    isRunning && elapsedSeconds >= 3600 && currentCount < KICK_RISK_THRESHOLD
      ? 'yellow'
      : 'green';

  return (
    <>
      <Stack.Screen options={{ title: 'Thai máy' }} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40, alignItems: 'center' }}
      >
        {/* Session Timer */}
        {isRunning && (
          <View className="mb-6 items-center">
            <Text className="text-brand-navy/60 text-sm mb-1">Thời gian phiên</Text>
            <Text className="text-3xl font-bold text-brand-navy font-mono">
              {formatDuration(elapsedSeconds)}
            </Text>
            {sessionRisk === 'yellow' && (
              <View className="mt-2 flex-row items-center gap-x-2">
                <RiskBadge risk_level="yellow" />
                <Text className="text-amber-700 text-xs flex-1">
                  Đã hơn 1 tiếng với dưới {KICK_RISK_THRESHOLD} cú đạp
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Big kick button */}
        <View className="mb-8">
          {isRunning ? (
            <KickButton
              count={currentCount}
              onPress={handleKick}
            />
          ) : (
            <View className="w-[200px] h-[200px] rounded-full bg-brand-gray items-center justify-center">
              <Text className="text-brand-navy/40 text-lg font-semibold text-center px-4">
                Nhấn bắt đầu để đếm thai máy
              </Text>
            </View>
          )}
        </View>

        {/* Controls */}
        <View className="w-full gap-y-3 mb-6">
          {!isRunning ? (
            <Button
              label="Bắt đầu đếm"
              variant="primary"
              size="lg"
              loading={isStarting}
              onPress={handleStart}
            />
          ) : (
            <>
              <Button
                label={`Lưu (${currentCount} cú đạp)`}
                variant="primary"
                size="lg"
                loading={isEnding}
                onPress={handleSave}
              />
              <Button
                label="Huỷ phiên"
                variant="secondary"
                size="md"
                onPress={handleCancel}
              />
            </>
          )}
        </View>

        {/* Today summary */}
        <Card padding="md" className="w-full mb-4">
          <Text className="text-brand-navy font-semibold mb-1">Hôm nay</Text>
          <Text className="text-brand-navy/60 text-sm">
            Tổng thai máy:{' '}
            <Text className="text-brand-navy font-bold">{todayKickCount}</Text> cú đạp
          </Text>
        </Card>

        {/* Guidance card */}
        <Card padding="md" className="w-full mb-4">
          <Text className="text-brand-navy font-semibold mb-1">
            Hướng dẫn đếm thai máy
          </Text>
          <Text className="text-brand-navy/70 text-sm leading-5">
            Thông thường thai nhi sẽ có ít nhất 10 cú đạp trong vòng 2 giờ (theo phương pháp Cardiff).
            Nếu không đủ 10 cú đạp sau 2 giờ theo dõi, hãy liên hệ bác sĩ.
          </Text>
        </Card>

        <AIDisclaimer className="w-full mb-4" />

        {/* Recent sessions */}
        {sessions.length > 0 && (
          <>
            <Text className="text-brand-navy font-semibold mb-2 self-start">
              Lịch sử gần đây
            </Text>
            {sessions.slice(0, 10).map((s) => {
              const lowKick = s.ended_at ? isSessionLowKick(s) : false;
              const label = formatSessionLabel(s.count, s.started_at, s.ended_at);
              return (
                <Card key={s.id} padding="sm" className="w-full mb-2">
                  <View className="flex-row items-center gap-x-2">
                    <View className="flex-1">
                      <Text className="text-brand-navy font-semibold text-sm">
                        {label}
                      </Text>
                      <Text className="text-brand-navy/50 text-xs mt-0.5">
                        {format(parseISO(s.started_at), 'HH:mm, dd/MM/yyyy')}
                      </Text>
                    </View>
                    {lowKick && <RiskBadge risk_level="yellow" />}
                    {s.ended_at && (
                      <TouchableOpacity
                        onPress={() => handleDelete(s.id, label)}
                        className="p-2"
                        accessibilityLabel="Xoa ban ghi"
                      >
                        <Text className="text-red-400 text-sm">Xoa</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </Card>
              );
            })}
          </>
        )}
      </ScrollView>
    </>
  );
}
