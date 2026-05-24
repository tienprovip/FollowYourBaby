// ---------------------------------------------------------------------------
// Health Screen — fever tracker, symptoms, medications
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
import { useBabySymptomLogs, feverRiskLevel } from '@/hooks/useSymptomLogs';
import { useBabyMedicationLogs } from '@/hooks/useMedicationLogs';
import { useToast } from '@/components/ui/Toast';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import RiskBadge from '@/components/ui/RiskBadge';
import AIDisclaimer from '@/components/ui/AIDisclaimer';
import SegmentedControl from '@/components/ui/SegmentedControl';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import type { Database } from '@/types/database';

type SymptomLog = Database['public']['Tables']['symptom_logs']['Row'];
type MedicationLog = Database['public']['Tables']['medication_logs']['Row'];

const HEALTH_SEGMENTS = [
  { key: 'fever', label: 'Sot' },
  { key: 'symptoms', label: 'Trieu chung' },
  { key: 'medications', label: 'Thuoc' },
];

const SYMPTOM_OPTIONS = [
  { key: 'ho', label: 'Ho', emoji: '🤧' },
  { key: 'so_mui', label: 'So mui', emoji: '👃' },
  { key: 'tieu_chay', label: 'Tieu chay', emoji: '🚽' },
  { key: 'non_tro', label: 'Non tro', emoji: '🤢' },
  { key: 'phat_ban', label: 'Phat ban', emoji: '🔴' },
  { key: 'quay_khoc', label: 'Quay khoc', emoji: '😭' },
  { key: 'biet_an', label: 'Biet an', emoji: '🍽️' },
  { key: 'kho_ngu', label: 'Kho ngu', emoji: '😴' },
];

export default function HealthScreen() {
  const {
    logs: symptomLogs,
    isLoading: sympLoading,
    maxFeverToday,
    addSymptomLog,
    isAdding: sympAdding,
    deleteSymptomLog,
  } = useBabySymptomLogs();
  const {
    logs: medLogs,
    isLoading: medLoading,
    addMedicationLog,
    isAdding: medAdding,
    deleteMedicationLog,
  } = useBabyMedicationLogs();
  const { show: showToast } = useToast();

  const [activeTab, setActiveTab] = useState('fever');
  const [showForm, setShowForm] = useState(false);

  // Fever form
  const [tempInput, setTempInput] = useState('');

  // Symptom form
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [symptomNote, setSymptomNote] = useState('');
  const [severity, setSeverity] = useState(2);

  // Medication form
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medNote, setMedNote] = useState('');

  // ----- Save handlers -----

  async function saveFever() {
    const temp = parseFloat(tempInput.replace(',', '.'));
    if (isNaN(temp) || temp < 35 || temp > 43) {
      Alert.alert('Loi', 'Nhiet do phai tu 35 den 43°C.');
      return;
    }
    try {
      await addSymptomLog({
        recorded_at: new Date().toISOString(),
        fever_c: temp,
        symptom_key: null,
        severity: null,
        note: null,
      });
      setTempInput('');
      setShowForm(false);
      showToast('Da ghi nhiet do — Hoan tac', 'success', 5000);
    } catch {
      Alert.alert('Loi', 'Khong the luu.');
    }
  }

  async function saveSymptom() {
    if (!selectedSymptom) {
      Alert.alert('Loi', 'Vui long chon trieu chung.');
      return;
    }
    try {
      await addSymptomLog({
        recorded_at: new Date().toISOString(),
        fever_c: null,
        symptom_key: selectedSymptom,
        severity,
        note: symptomNote || null,
      });
      setSelectedSymptom('');
      setSymptomNote('');
      setSeverity(2);
      setShowForm(false);
      showToast('Da ghi trieu chung — Hoan tac', 'success', 5000);
    } catch {
      Alert.alert('Loi', 'Khong the luu.');
    }
  }

  async function saveMedication() {
    if (!medName.trim()) {
      Alert.alert('Loi', 'Vui long nhap ten thuoc.');
      return;
    }
    try {
      await addMedicationLog({
        name: medName.trim(),
        dosage: medDosage.trim() || null,
        given_at: new Date().toISOString(),
        note: medNote.trim() || null,
      });
      setMedName('');
      setMedDosage('');
      setMedNote('');
      setShowForm(false);
      showToast('Da ghi thuoc — Hoan tac', 'success', 5000);
    } catch {
      Alert.alert('Loi', 'Khong the luu.');
    }
  }

  const handleDeleteSymptom = useCallback(
    (id: string) => {
      Alert.alert('Xoa ban ghi', 'Ban co chac?', [
        { text: 'Huy', style: 'cancel' },
        {
          text: 'Xoa',
          style: 'destructive',
          onPress: async () => {
            try { await deleteSymptomLog(id); } catch { Alert.alert('Loi', 'Khong the xoa.'); }
          },
        },
      ]);
    },
    [deleteSymptomLog],
  );

  const handleDeleteMed = useCallback(
    (id: string) => {
      Alert.alert('Xoa ban ghi', 'Ban co chac?', [
        { text: 'Huy', style: 'cancel' },
        {
          text: 'Xoa',
          style: 'destructive',
          onPress: async () => {
            try { await deleteMedicationLog(id); } catch { Alert.alert('Loi', 'Khong the xoa.'); }
          },
        },
      ]);
    },
    [deleteMedicationLog],
  );

  // ----- Render -----

  function renderFeverSection() {
    const feverLogs = symptomLogs.filter((l) => l.fever_c !== null);
    const riskLevel = feverRiskLevel(maxFeverToday);

    return (
      <>
        {/* Alert banner */}
        {maxFeverToday !== null && riskLevel !== 'green' && (
          <Card
            padding="md"
            className={`mb-4 ${riskLevel === 'red' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}
          >
            <View className="flex-row items-center gap-x-2 mb-1">
              <RiskBadge risk_level={riskLevel} />
              <Text className="text-brand-navy font-bold text-lg">
                {maxFeverToday?.toFixed(1)}°C
              </Text>
            </View>
            <Text
              className={`text-sm ${riskLevel === 'red' ? 'text-red-700' : 'text-amber-700'}`}
            >
              {riskLevel === 'red'
                ? 'Sot cao — can dua be den bac si ngay'
                : 'Be co sot nhe — theo doi them'}
            </Text>
          </Card>
        )}

        {/* AI disclaimer always visible on health screen */}
        <AIDisclaimer className="mb-4" />

        {!showForm ? (
          <Button
            label="+ Ghi nhiet do"
            variant="primary"
            size="lg"
            className="mb-4"
            onPress={() => setShowForm(true)}
          />
        ) : (
          <Card padding="md" className="mb-4">
            <Text className="text-brand-navy font-semibold mb-3">
              Nhiet do hien tai
            </Text>
            <View className="flex-row items-center gap-x-2 mb-4">
              <TextInput
                value={tempInput}
                onChangeText={setTempInput}
                placeholder="37.5"
                keyboardType="decimal-pad"
                className="flex-1 border border-brand-gray rounded-input px-4 py-3 text-brand-navy text-xl font-bold text-center"
                style={inputStyles.field}
                placeholderTextColor="#1F2B5B40"
              />
              <Text className="text-brand-navy font-bold text-xl">°C</Text>
            </View>
            {/* Quick temp buttons */}
            <View className="flex-row gap-x-2 mb-4 flex-wrap">
              {[36.5, 37.0, 37.5, 38.0, 38.5, 39.0, 39.5, 40.0].map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setTempInput(String(t))}
                  className={`px-3 py-2 rounded-btn border mb-2 ${
                    tempInput === String(t)
                      ? t >= 39
                        ? 'border-red-400 bg-red-50'
                        : t >= 38
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-brand-mint bg-brand-mint/10'
                      : 'border-brand-gray bg-white'
                  }`}
                  accessibilityRole="button"
                  accessibilityLabel={`${t}°C`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      t >= 39
                        ? 'text-red-600'
                        : t >= 38
                        ? 'text-amber-700'
                        : 'text-brand-navy'
                    }`}
                  >
                    {t}°
                  </Text>
                </Pressable>
              ))}
            </View>
            <View className="flex-row gap-x-3">
              <Button
                label="Luu"
                variant="primary"
                size="md"
                className="flex-1"
                loading={sympAdding}
                onPress={saveFever}
              />
              <Button
                label="Huy"
                variant="secondary"
                size="md"
                className="flex-1"
                onPress={() => {
                  setShowForm(false);
                  setTempInput('');
                }}
              />
            </View>
          </Card>
        )}

        {/* Fever history */}
        {sympLoading ? (
          <LoadingSpinner />
        ) : feverLogs.length === 0 ? (
          <EmptyState title="Chua co ban ghi nhiet do" />
        ) : (
          feverLogs.map((log) => (
            <FeverLogRow
              key={log.id}
              log={log}
              onDelete={() => handleDeleteSymptom(log.id)}
            />
          ))
        )}
      </>
    );
  }

  function renderSymptomsSection() {
    const sympLogs = symptomLogs.filter((l) => l.symptom_key !== null);

    return (
      <>
        {!showForm ? (
          <Button
            label="+ Ghi trieu chung"
            variant="primary"
            size="lg"
            className="mb-4"
            onPress={() => setShowForm(true)}
          />
        ) : (
          <Card padding="md" className="mb-4">
            <Text className="text-brand-navy font-semibold mb-3">
              Chon trieu chung
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {SYMPTOM_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.key}
                  onPress={() => setSelectedSymptom(opt.key)}
                  className={`flex-row items-center gap-x-1 px-3 py-2 rounded-btn border ${
                    selectedSymptom === opt.key
                      ? 'border-brand-pink bg-brand-pink/10'
                      : 'border-brand-gray bg-white'
                  }`}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selectedSymptom === opt.key }}
                >
                  <Text>{opt.emoji}</Text>
                  <Text
                    className={`text-sm font-medium ${
                      selectedSymptom === opt.key
                        ? 'text-brand-pink'
                        : 'text-brand-navy/70'
                    }`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            {/* Severity */}
            <Text className="text-brand-navy text-sm font-semibold mb-2">
              Muc do: {severity}/5
            </Text>
            <View className="flex-row gap-x-2 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setSeverity(s)}
                  className={`flex-1 h-10 rounded-btn items-center justify-center ${
                    s <= severity ? 'bg-brand-pink' : 'bg-brand-gray'
                  }`}
                  accessibilityRole="button"
                  accessibilityLabel={`Muc do ${s}`}
                >
                  <Text className="text-white font-bold text-sm">{s}</Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={symptomNote}
              onChangeText={setSymptomNote}
              placeholder="Ghi chu them (tuy chon)"
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
                loading={sympAdding}
                onPress={saveSymptom}
              />
              <Button
                label="Huy"
                variant="secondary"
                size="md"
                className="flex-1"
                onPress={() => {
                  setShowForm(false);
                  setSelectedSymptom('');
                  setSymptomNote('');
                }}
              />
            </View>
          </Card>
        )}

        {sympLoading ? (
          <LoadingSpinner />
        ) : sympLogs.length === 0 ? (
          <EmptyState title="Chua co ban ghi trieu chung" />
        ) : (
          sympLogs.map((log) => (
            <SymptomLogRow
              key={log.id}
              log={log}
              onDelete={() => handleDeleteSymptom(log.id)}
            />
          ))
        )}
      </>
    );
  }

  function renderMedicationsSection() {
    return (
      <>
        {!showForm ? (
          <Button
            label="+ Ghi thuoc"
            variant="primary"
            size="lg"
            className="mb-4"
            onPress={() => setShowForm(true)}
          />
        ) : (
          <Card padding="md" className="mb-4">
            <Text className="text-brand-navy font-semibold mb-3">
              Thong tin thuoc
            </Text>
            <TextInput
              value={medName}
              onChangeText={setMedName}
              placeholder="Ten thuoc *"
              className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy text-sm mb-3"
              placeholderTextColor="#1F2B5B60"
              style={inputStyles.field}
            />
            <TextInput
              value={medDosage}
              onChangeText={setMedDosage}
              placeholder="Lieu luong (vi du: 5ml / 1 vien)"
              className="border border-brand-gray rounded-input px-4 py-3 text-brand-navy text-sm mb-3"
              placeholderTextColor="#1F2B5B60"
              style={inputStyles.field}
            />
            <TextInput
              value={medNote}
              onChangeText={setMedNote}
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
                loading={medAdding}
                onPress={saveMedication}
              />
              <Button
                label="Huy"
                variant="secondary"
                size="md"
                className="flex-1"
                onPress={() => {
                  setShowForm(false);
                  setMedName('');
                  setMedDosage('');
                  setMedNote('');
                }}
              />
            </View>
          </Card>
        )}

        {medLoading ? (
          <LoadingSpinner />
        ) : medLogs.length === 0 ? (
          <EmptyState title="Chua co ban ghi thuoc" />
        ) : (
          medLogs.map((log) => (
            <MedLogRow
              key={log.id}
              log={log}
              onDelete={() => handleDeleteMed(log.id)}
            />
          ))
        )}
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Suc khoe' }} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1 bg-brand-peach"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          <SegmentedControl
            options={HEALTH_SEGMENTS}
            selectedKey={activeTab}
            onChange={(k) => {
              setActiveTab(k);
              setShowForm(false);
            }}
            className="mb-4"
          />

          {activeTab === 'fever' && renderFeverSection()}
          {activeTab === 'symptoms' && renderSymptomsSection()}
          {activeTab === 'medications' && renderMedicationsSection()}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

// ---------------------------------------------------------------------------
// Row components
// ---------------------------------------------------------------------------

function FeverLogRow({
  log,
  onDelete,
}: {
  log: SymptomLog;
  onDelete: () => void;
}) {
  const temp = Number(log.fever_c);
  const risk = feverRiskLevel(temp);
  const timeStr = format(parseISO(log.recorded_at), 'HH:mm dd/MM', {
    locale: vi,
  });

  return (
    <Card
      padding="sm"
      className={`mb-2 ${
        risk === 'red'
          ? 'border-red-300'
          : risk === 'yellow'
          ? 'border-amber-300'
          : ''
      }`}
    >
      <View className="flex-row items-center">
        <Text style={{ fontSize: 22 }} className="mr-3">
          🌡️
        </Text>
        <View className="flex-1">
          <View className="flex-row items-center gap-x-2">
            <Text className="text-brand-navy font-bold text-xl">
              {temp.toFixed(1)}°C
            </Text>
            {risk !== 'green' && <RiskBadge risk_level={risk} />}
          </View>
          <Text className="text-brand-navy/50 text-xs">{timeStr}</Text>
        </View>
        <TouchableOpacity onPress={onDelete} className="p-2" accessibilityLabel="Xoa">
          <Text className="text-red-400 text-sm">Xoa</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

function SymptomLogRow({
  log,
  onDelete,
}: {
  log: SymptomLog;
  onDelete: () => void;
}) {
  const opt = SYMPTOM_OPTIONS.find((s) => s.key === log.symptom_key);
  const timeStr = format(parseISO(log.recorded_at), 'HH:mm dd/MM', {
    locale: vi,
  });

  return (
    <Card padding="sm" className="mb-2">
      <View className="flex-row items-center">
        <Text style={{ fontSize: 22 }} className="mr-3">
          {opt?.emoji ?? '📋'}
        </Text>
        <View className="flex-1">
          <Text className="text-brand-navy font-semibold text-sm">
            {opt?.label ?? log.symptom_key}
          </Text>
          {log.severity != null && (
            <Text className="text-xs text-brand-navy/60">
              Muc do: {log.severity}/5
            </Text>
          )}
          <Text className="text-brand-navy/50 text-xs">{timeStr}</Text>
          {log.note && (
            <Text className="text-brand-navy/50 text-xs">{log.note}</Text>
          )}
        </View>
        <TouchableOpacity onPress={onDelete} className="p-2" accessibilityLabel="Xoa">
          <Text className="text-red-400 text-sm">Xoa</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

function MedLogRow({
  log,
  onDelete,
}: {
  log: MedicationLog;
  onDelete: () => void;
}) {
  const timeStr = format(parseISO(log.given_at), 'HH:mm dd/MM', {
    locale: vi,
  });

  return (
    <Card padding="sm" className="mb-2">
      <View className="flex-row items-center">
        <Text style={{ fontSize: 22 }} className="mr-3">
          💊
        </Text>
        <View className="flex-1">
          <Text className="text-brand-navy font-semibold text-sm">
            {log.name}
          </Text>
          {log.dosage && (
            <Text className="text-xs text-brand-navy/70">{log.dosage}</Text>
          )}
          <Text className="text-brand-navy/50 text-xs">{timeStr}</Text>
          {log.note && (
            <Text className="text-brand-navy/50 text-xs">{log.note}</Text>
          )}
        </View>
        <TouchableOpacity onPress={onDelete} className="p-2" accessibilityLabel="Xoa">
          <Text className="text-red-400 text-sm">Xoa</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
