// ---------------------------------------------------------------------------
// Milestone Detail Screen — full info, mark achieved flow, delay alert.
// ---------------------------------------------------------------------------

import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useBaby } from '@/hooks/useBaby';
import { useMilestoneCatalog } from '@/hooks/useMilestoneCatalog';
import { useMilestones } from '@/hooks/useMilestones';
import { useToast } from '@/components/ui/Toast';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import DateField from '@/components/ui/DateField';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import AchievedBadge from '@/components/milestones/AchievedBadge';
import DelayAlert from '@/components/milestones/DelayAlert';
import AIDisclaimer from '@/components/ui/AIDisclaimer';
import Badge from '@/components/ui/Badge';

const CATEGORY_LABELS: Record<string, string> = {
  motor: 'Van dong',
  language: 'Ngon ngu',
  cognitive: 'Nhan thuc',
  social: 'Xa hoi',
};

function ageStatusLabel(
  babyAgeInMonths: number,
  ageMin: number,
  ageMax: number,
  isAchieved: boolean,
): { text: string; variant: 'green' | 'blue' | 'yellow' } {
  if (isAchieved) return { text: 'Da dat duoc', variant: 'green' };
  if (babyAgeInMonths < ageMin) return { text: 'Chua den tuoi', variant: 'blue' };
  if (babyAgeInMonths <= ageMax) return { text: 'Dung ky vong', variant: 'green' };
  return { text: 'Can theo doi', variant: 'yellow' };
}

export default function MilestoneDetailScreen() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const { baby, isLoading: babyLoading } = useBaby();
  const { catalog, isLoading: catalogLoading } = useMilestoneCatalog();
  const babyAge = baby?.ageInMonths ?? 0;
  const {
    achievedMap,
    markAchieved,
    isMarking,
    unmarkAchieved,
    isUnmarking,
    isLoading: milestonesLoading,
  } = useMilestones(babyAge);
  const { show: showToast } = useToast();

  const [showMarkModal, setShowMarkModal] = useState(false);
  const [achievedDate, setAchievedDate] = useState(new Date());
  const [noteInput, setNoteInput] = useState('');

  if (babyLoading || catalogLoading || milestonesLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-peach">
        <LoadingSpinner />
      </View>
    );
  }

  const catalogItem = catalog.find((c) => c.key === key);
  if (!catalogItem) {
    return (
      <EmptyState
        title="Khong tim thay"
        body="Moc phat trien nay khong ton tai."
        cta={{ label: 'Quay lai', onPress: () => router.back() }}
      />
    );
  }

  const achievedRecord = achievedMap.get(catalogItem.key) ?? null;
  const isAchieved = Boolean(achievedRecord?.achieved_at);
  const isOverdue = babyAge > catalogItem.age_max_months && !isAchieved;
  const statusInfo = ageStatusLabel(
    babyAge,
    catalogItem.age_min_months,
    catalogItem.age_max_months,
    isAchieved,
  );

  async function handleMark() {
    try {
      await markAchieved({
        key: catalogItem!.key,
        category: catalogItem!.category,
        achieved_at: achievedDate.toISOString().split('T')[0],
        note: noteInput.trim() || null,
      });
      setShowMarkModal(false);
      setNoteInput('');
      showToast(
        `Chuc mung! Be da dat moc "${catalogItem!.title_vi}"`,
        'success',
        4000,
      );
    } catch {
      Alert.alert('Loi', 'Khong the luu. Vui long thu lai.');
    }
  }

  async function handleUnmark() {
    Alert.alert(
      'Xoa moc da dat',
      `Ban co muon xoa moc "${catalogItem!.title_vi}"?`,
      [
        { text: 'Huy', style: 'cancel' },
        {
          text: 'Xoa',
          style: 'destructive',
          onPress: async () => {
            try {
              await unmarkAchieved(catalogItem!.key);
              showToast('Da xoa moc da dat', 'info');
            } catch {
              Alert.alert('Loi', 'Khong the xoa. Vui long thu lai.');
            }
          },
        },
      ],
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: catalogItem.title_vi }} />

      <ScrollView
        className="flex-1 bg-brand-peach"
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
      >
        {/* Header card */}
        <Card padding="md" className="mb-4">
          <View className="flex-row items-center gap-x-2 mb-2 flex-wrap">
            <Badge
              label={CATEGORY_LABELS[catalogItem.category] ?? catalogItem.category}
              variant="blue"
            />
            <Badge
              label={statusInfo.text}
              variant={statusInfo.variant}
            />
          </View>

          <Text className="text-brand-navy text-xl font-bold mb-1">
            {catalogItem.title_vi}
          </Text>

          <Text className="text-brand-navy/60 text-sm mb-3">
            Thuong dat duoc tu {catalogItem.age_min_months}–{catalogItem.age_max_months} thang tuoi
          </Text>

          {/* Baby age vs range */}
          {baby && (
            <View className="bg-brand-peach rounded-input px-3 py-2 mb-3">
              <Text className="text-brand-navy/70 text-xs">
                {baby.name} hien tai: {baby.ageLabel}
              </Text>
            </View>
          )}

          {/* Achieved info */}
          {isAchieved && achievedRecord?.achieved_at ? (
            <AchievedBadge achievedAt={achievedRecord.achieved_at} />
          ) : null}
        </Card>

        {/* Description */}
        <Card padding="md" className="mb-4">
          <Text className="text-brand-navy font-semibold mb-2">Mo ta</Text>
          <Text className="text-brand-navy/70 text-sm leading-6">
            {catalogItem.description_vi}
          </Text>
        </Card>

        {/* Note (if achieved) */}
        {isAchieved && achievedRecord?.note ? (
          <Card padding="md" className="mb-4">
            <Text className="text-brand-navy font-semibold mb-1">Ghi chu</Text>
            <Text className="text-brand-navy/70 text-sm leading-5">
              {achievedRecord.note}
            </Text>
          </Card>
        ) : null}

        {/* Delay alert */}
        {isOverdue && (
          <DelayAlert
            milestoneTitle={catalogItem.title_vi}
            className="mb-4"
          />
        )}

        {/* Action buttons */}
        {isAchieved ? (
          <View className="gap-y-3">
            <Button
              label="Chinh sua"
              variant="secondary"
              size="md"
              onPress={() => {
                const existing = achievedRecord?.achieved_at
                  ? new Date(achievedRecord.achieved_at)
                  : new Date();
                setAchievedDate(existing);
                setNoteInput(achievedRecord?.note ?? '');
                setShowMarkModal(true);
              }}
            />
            <Button
              label="Xoa moc da dat"
              variant="ghost"
              size="md"
              loading={isUnmarking}
              onPress={handleUnmark}
            />
          </View>
        ) : (
          <Button
            label="Danh dau dat"
            variant="primary"
            size="lg"
            onPress={() => {
              setAchievedDate(new Date());
              setNoteInput('');
              setShowMarkModal(true);
            }}
          />
        )}

        {/* Disclaimer always present */}
        <AIDisclaimer className="mt-6" />
      </ScrollView>

      {/* Mark achieved modal */}
      <Modal
        visible={showMarkModal}
        onDismiss={() => setShowMarkModal(false)}
        accessibilityLabel="Danh dau dat moc"
      >
        <Text className="text-brand-navy text-lg font-bold mb-4">
          {isAchieved ? 'Chinh sua moc' : 'Danh dau dat'}
        </Text>

        <DateField
          label="Ngay dat"
          value={achievedDate}
          onChange={setAchievedDate}
          maximumDate={new Date()}
          className="mb-4"
        />

        <Input
          label="Ghi chu (tuy chon)"
          value={noteInput}
          onChangeText={setNoteInput}
          placeholder="Be lan dau bo vao ngay..."
          multiline
          numberOfLines={3}
          className="mb-6"
          inputClassName="h-auto"
        />

        <View className="flex-row gap-x-3">
          <Button
            label="Luu"
            variant="primary"
            size="md"
            className="flex-1"
            loading={isMarking}
            onPress={handleMark}
          />
          <Button
            label="Huy"
            variant="secondary"
            size="md"
            className="flex-1"
            onPress={() => setShowMarkModal(false)}
          />
        </View>
      </Modal>
    </>
  );
}
