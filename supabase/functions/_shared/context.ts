// Context bundler — loads caller-scoped data via the user's RLS-scoped client.
// All queries pass through RLS so unauthorized rows are never returned.

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface UserProfile {
  id: string;
  full_name: string | null;
  role: string | null;
  locale: string;
}

export interface BabyContext {
  id: string;
  name: string;
  dob: string;
  sex: string | null;
  age_months: number;
  birth_weight_g: number | null;
  recent_feeds: Array<{ started_at: string; type: string; amount_ml: number | null; side: string | null }>;
  recent_sleeps: Array<{ started_at: string; ended_at: string | null; kind: string }>;
  recent_diapers: Array<{ recorded_at: string; kind: string }>;
  recent_growth: Array<{ recorded_at: string; weight_g: number | null; length_cm: number | null }>;
  recent_symptoms: Array<{ recorded_at: string; symptom_key: string | null; severity: number | null; fever_c: number | null }>;
  achieved_milestones: Array<{ key: string; achieved_at: string | null; category: string }>;
  overdue_milestones: Array<{ key: string; title_vi: string; age_max_months: number }>;
}

export interface PregnancyContext {
  id: string;
  due_date: string | null;
  lmp_date: string | null;
  status: string;
  week: number | null;
  recent_kicks: Array<{ started_at: string; count: number }>;
  recent_weights: Array<{ recorded_at: string; weight_kg: number }>;
  recent_symptoms: Array<{ recorded_at: string; symptom_key: string; severity: number | null }>;
  upcoming_visits: Array<{ scheduled_at: string; type: string; location: string | null }>;
  active_medications: Array<{ name: string; dosage: string | null }>;
}

export interface MemoryEntry {
  key: string;
  value: unknown;
}

export async function loadProfile(client: SupabaseClient, userId: string): Promise<UserProfile | null> {
  const { data } = await client
    .from('profiles')
    .select('id, full_name, role, locale')
    .eq('id', userId)
    .single();
  return (data as UserProfile | null) ?? null;
}

export function calcAgeMonths(dob: string): number {
  const birth = new Date(dob).getTime();
  const now = Date.now();
  const months = (now - birth) / (1000 * 60 * 60 * 24 * 30.4375);
  return Math.max(0, Math.floor(months));
}

export function calcPregnancyWeek(lmp: string | null, due: string | null): number | null {
  if (lmp) {
    const days = (Date.now() - new Date(lmp).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.floor(days / 7));
  }
  if (due) {
    const daysToDue = (new Date(due).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.floor(40 - daysToDue / 7));
  }
  return null;
}

export async function loadBabyContext(
  client: SupabaseClient,
  babyId: string,
): Promise<BabyContext | null> {
  const { data: baby } = await client
    .from('babies')
    .select('id, name, dob, sex, birth_weight_g')
    .eq('id', babyId)
    .maybeSingle();
  if (!baby) return null;

  const since = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const ageMonths = calcAgeMonths(baby.dob as string);

  const [feeds, sleeps, diapers, growth, symptoms, ms, catalog] = await Promise.all([
    client.from('feed_logs').select('started_at, type, amount_ml, side').eq('baby_id', babyId).gte('started_at', since).order('started_at', { ascending: false }).limit(20),
    client.from('sleep_logs').select('started_at, ended_at, kind').eq('baby_id', babyId).gte('started_at', since).order('started_at', { ascending: false }).limit(20),
    client.from('diaper_logs').select('recorded_at, kind').eq('baby_id', babyId).gte('recorded_at', since).order('recorded_at', { ascending: false }).limit(20),
    client.from('growth_logs').select('recorded_at, weight_g, length_cm').eq('baby_id', babyId).order('recorded_at', { ascending: false }).limit(5),
    client.from('symptom_logs').select('recorded_at, symptom_key, severity, fever_c').eq('baby_id', babyId).gte('recorded_at', since).order('recorded_at', { ascending: false }).limit(20),
    client.from('milestones').select('key, achieved_at, category').eq('baby_id', babyId).not('achieved_at', 'is', null).order('achieved_at', { ascending: false }).limit(10),
    client.from('milestone_catalog').select('key, title_vi, age_max_months').lt('age_max_months', ageMonths).limit(100),
  ]);

  const achievedKeys = new Set((ms.data ?? []).map((m: { key: string }) => m.key));
  const overdue = (catalog.data ?? [])
    .filter((c: { key: string }) => !achievedKeys.has(c.key))
    .slice(0, 5)
    .map((c: { key: string; title_vi: string; age_max_months: number }) => ({
      key: c.key,
      title_vi: c.title_vi,
      age_max_months: c.age_max_months,
    }));

  return {
    id: baby.id as string,
    name: baby.name as string,
    dob: baby.dob as string,
    sex: (baby.sex as string | null) ?? null,
    age_months: ageMonths,
    birth_weight_g: (baby.birth_weight_g as number | null) ?? null,
    recent_feeds: (feeds.data ?? []) as BabyContext['recent_feeds'],
    recent_sleeps: (sleeps.data ?? []) as BabyContext['recent_sleeps'],
    recent_diapers: (diapers.data ?? []) as BabyContext['recent_diapers'],
    recent_growth: (growth.data ?? []) as BabyContext['recent_growth'],
    recent_symptoms: (symptoms.data ?? []) as BabyContext['recent_symptoms'],
    achieved_milestones: (ms.data ?? []) as BabyContext['achieved_milestones'],
    overdue_milestones: overdue,
  };
}

export async function loadPregnancyContext(
  client: SupabaseClient,
  pregnancyId: string,
): Promise<PregnancyContext | null> {
  const { data: pg } = await client
    .from('pregnancies')
    .select('id, due_date, lmp_date, status')
    .eq('id', pregnancyId)
    .maybeSingle();
  if (!pg) return null;

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const nowIso = new Date().toISOString();

  const [kicks, weights, symptoms, visits, meds] = await Promise.all([
    client.from('kick_counts').select('started_at, count').eq('pregnancy_id', pregnancyId).order('started_at', { ascending: false }).limit(3),
    client.from('pregnancy_weights').select('recorded_at, weight_kg').eq('pregnancy_id', pregnancyId).order('recorded_at', { ascending: false }).limit(3),
    client.from('pregnancy_symptoms').select('recorded_at, symptom_key, severity').eq('pregnancy_id', pregnancyId).gte('recorded_at', since).order('recorded_at', { ascending: false }).limit(10),
    client.from('prenatal_visits').select('scheduled_at, type, location').eq('pregnancy_id', pregnancyId).gte('scheduled_at', nowIso).order('scheduled_at', { ascending: true }).limit(3),
    client.from('pregnancy_medications').select('name, dosage').eq('pregnancy_id', pregnancyId).is('ended_at', null).limit(10),
  ]);

  return {
    id: pg.id as string,
    due_date: (pg.due_date as string | null) ?? null,
    lmp_date: (pg.lmp_date as string | null) ?? null,
    status: pg.status as string,
    week: calcPregnancyWeek(pg.lmp_date as string | null, pg.due_date as string | null),
    recent_kicks: (kicks.data ?? []) as PregnancyContext['recent_kicks'],
    recent_weights: (weights.data ?? []) as PregnancyContext['recent_weights'],
    recent_symptoms: (symptoms.data ?? []) as PregnancyContext['recent_symptoms'],
    upcoming_visits: (visits.data ?? []) as PregnancyContext['upcoming_visits'],
    active_medications: (meds.data ?? []) as PregnancyContext['active_medications'],
  };
}

export async function loadMemory(
  client: SupabaseClient,
  userId: string,
  babyId?: string | null,
  pregnancyId?: string | null,
): Promise<MemoryEntry[]> {
  let q = client.from('ai_memory').select('key, value').eq('owner_id', userId);
  if (babyId) q = q.eq('baby_id', babyId);
  if (pregnancyId) q = q.eq('pregnancy_id', pregnancyId);
  const { data } = await q.limit(20);
  return ((data ?? []) as MemoryEntry[]);
}

export async function loadRecentMessages(
  client: SupabaseClient,
  conversationId: string,
  limit = 10,
): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
  const { data } = await client
    .from('ai_messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .neq('role', 'system')
    .order('created_at', { ascending: false })
    .limit(limit);
  const rows = ((data ?? []) as Array<{ role: 'user' | 'assistant'; content: string }>).reverse();
  return rows;
}

// ---------------- Formatting helpers (for system prompt) ----------------

const ROLE_VI: Record<string, string> = {
  pregnant_mother: 'mẹ bầu',
  parent: 'phụ huynh',
  caregiver: 'người chăm sóc',
};

export function formatProfileForPrompt(p: UserProfile): string {
  return [
    `- Tên: ${p.full_name ?? 'Người dùng'}`,
    `- Vai trò: ${p.role ? (ROLE_VI[p.role] ?? p.role) : 'không rõ'}`,
  ].join('\n');
}

export function formatBabyForPrompt(b: BabyContext): string {
  const feedTotalMl = b.recent_feeds.reduce((s, f) => s + (f.amount_ml ?? 0), 0);
  const sleepHrs = b.recent_sleeps.reduce((s, l) => {
    if (!l.ended_at) return s;
    return s + (new Date(l.ended_at).getTime() - new Date(l.started_at).getTime()) / 3600000;
  }, 0);
  const lastGrowth = b.recent_growth[0];
  const symptomLines = b.recent_symptoms.slice(0, 5).map((s) => `  - ${s.symptom_key ?? 'triệu chứng'} (mức ${s.severity ?? '?'}${s.fever_c ? `, sốt ${s.fever_c}°C` : ''})`).join('\n');
  const overdueLines = b.overdue_milestones.map((m) => `  - ${m.title_vi} (lẽ ra đạt trước ${m.age_max_months} tháng)`).join('\n');

  return [
    `Em bé: ${b.name}, ${b.age_months} tháng tuổi, giới tính ${b.sex ?? 'chưa rõ'}.`,
    `Cân nặng sơ sinh: ${b.birth_weight_g ?? 'chưa có'} g.`,
    lastGrowth ? `Đo gần nhất: ${lastGrowth.weight_g ?? '?'} g, ${lastGrowth.length_cm ?? '?'} cm.` : 'Chưa có số đo tăng trưởng.',
    `3 ngày qua: ${b.recent_feeds.length} cữ bú/ăn (tổng ~${Math.round(feedTotalMl)} ml), ngủ ~${sleepHrs.toFixed(1)}h, ${b.recent_diapers.length} lần tã.`,
    symptomLines ? `Triệu chứng gần đây:\n${symptomLines}` : 'Không có triệu chứng gần đây.',
    overdueLines ? `Mốc phát triển có thể đang chậm:\n${overdueLines}` : '',
  ].filter(Boolean).join('\n');
}

export function formatPregnancyForPrompt(p: PregnancyContext): string {
  const kickLines = p.recent_kicks.map((k) => `  - ${new Date(k.started_at).toLocaleDateString('vi-VN')}: ${k.count} lần`).join('\n');
  const weightLines = p.recent_weights.map((w) => `  - ${new Date(w.recorded_at).toLocaleDateString('vi-VN')}: ${w.weight_kg} kg`).join('\n');
  const visitLines = p.upcoming_visits.map((v) => `  - ${new Date(v.scheduled_at).toLocaleString('vi-VN')} (${v.type})${v.location ? ` tại ${v.location}` : ''}`).join('\n');
  const medLines = p.active_medications.map((m) => `  - ${m.name}${m.dosage ? ` (${m.dosage})` : ''}`).join('\n');
  return [
    `Thai kỳ: tuần ${p.week ?? '?'}, dự sinh ${p.due_date ?? 'chưa rõ'}, trạng thái ${p.status}.`,
    kickLines ? `Thai máy gần đây:\n${kickLines}` : 'Chưa ghi nhận thai máy gần đây.',
    weightLines ? `Cân nặng gần đây:\n${weightLines}` : 'Chưa có ghi nhận cân nặng.',
    visitLines ? `Lịch khám sắp tới:\n${visitLines}` : '',
    medLines ? `Thuốc/vitamin đang dùng:\n${medLines}` : '',
  ].filter(Boolean).join('\n');
}

export function formatMemoryForPrompt(entries: MemoryEntry[]): string {
  if (!entries.length) return '';
  const lines = entries.map((e) => `- ${e.key}: ${typeof e.value === 'string' ? e.value : JSON.stringify(e.value)}`);
  return `Ghi nhớ cá nhân:\n${lines.join('\n')}`;
}
