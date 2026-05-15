// ---------------------------------------------------------------------------
// App metadata
// ---------------------------------------------------------------------------

export const APP_NAME = 'FollowYourBaby';
export const APP_SCHEME = 'followyourbaby';
export const APP_VERSION = '1.0.0';

// ---------------------------------------------------------------------------
// Color tokens — mirrors the Tailwind pastel palette in tailwind.config.js
// Use these in StyleSheet.create() or NativeWind className strings.
// ---------------------------------------------------------------------------

export const COLORS = {
  // Rose — primary brand / CTAs
  rose50: '#fff5f7',
  rose100: '#ffe4ea',
  rose200: '#ffc2cf',
  rose300: '#ff9db4',
  rose400: '#ff7096',
  rose500: '#f43f5e',
  rose600: '#e11d48',

  // Mint — positive states, growth milestones
  mint50: '#f0fdf4',
  mint100: '#dcfce7',
  mint200: '#bbf7d0',
  mint300: '#86efac',
  mint500: '#22c55e',
  mint600: '#16a34a',

  // Cream — neutral backgrounds, cards
  cream50: '#fffdf7',
  cream100: '#fef9ec',
  cream200: '#fdf0c8',

  // Soft blue — informational, calendar
  softBlue50: '#eff8ff',
  softBlue100: '#dbeafe',
  softBlue200: '#bfdbfe',
  softBlue300: '#93c5fd',
  softBlue500: '#3b82f6',

  // Neutrals
  white: '#ffffff',
  black: '#000000',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray500: '#6b7280',
  gray700: '#374151',
  gray900: '#111827',
} as const;

// ---------------------------------------------------------------------------
// AI risk levels — used on every AI response to drive UI warnings
// ---------------------------------------------------------------------------

export const RISK_LEVEL = {
  /** Thông tin bình thường, không cần chú ý đặc biệt */
  GREEN: 'green',
  /** Cần chú ý, nên theo dõi thêm */
  YELLOW: 'yellow',
  /** Cần gặp bác sĩ ngay */
  RED: 'red',
} as const;

export type RiskLevel = (typeof RISK_LEVEL)[keyof typeof RISK_LEVEL];

// ---------------------------------------------------------------------------
// AI disclaimer — must appear on every AI-generated output in the UI
// ---------------------------------------------------------------------------

export const AI_DISCLAIMER =
  'Thông tin từ trợ lý AI chỉ mang tính tham khảo và không thay thế tư vấn của bác sĩ.';

// ---------------------------------------------------------------------------
// User roles
// ---------------------------------------------------------------------------

export const USER_ROLE = {
  PREGNANT_MOTHER: 'pregnant_mother',
  PARENT: 'parent',
  CAREGIVER: 'caregiver',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

// ---------------------------------------------------------------------------
// Care-sharing permission levels
// ---------------------------------------------------------------------------

export const CARE_PERMISSION = {
  VIEW: 'view',
  EDIT: 'edit',
  ADMIN: 'admin',
} as const;

export type CarePermission = (typeof CARE_PERMISSION)[keyof typeof CARE_PERMISSION];

// ---------------------------------------------------------------------------
// Journey types (set during onboarding)
// ---------------------------------------------------------------------------

export const JOURNEY = {
  PREGNANT: 'pregnant',
  HAS_BABY: 'has_baby',
  MULTIPLE: 'multiple',
} as const;

export type Journey = (typeof JOURNEY)[keyof typeof JOURNEY];
