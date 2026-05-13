// ---------------------------------------------------------------------------
// App-specific TypeScript types
// Supabase DB types are auto-generated into types/database.ts by the CLI —
// do not write those by hand.
// ---------------------------------------------------------------------------

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: import('@/lib/constants').UserRole;
  journey: import('@/lib/constants').Journey;
  createdAt: string;
  updatedAt: string;
}

export interface BabyProfile {
  id: string;
  ownerId: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female' | 'unknown';
  birthWeightGrams: number | null;
  birthHeightCm: number | null;
  allergies: string[];
  medications: string[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PregnancyProfile {
  id: string;
  ownerId: string;
  dueDate: string;
  lastMenstrualPeriod: string | null;
  currentWeek: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CareShare {
  id: string;
  resourceId: string;
  resourceType: 'baby' | 'pregnancy';
  sharedWithUserId: string;
  permission: import('@/lib/constants').CarePermission;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// AI types
// ---------------------------------------------------------------------------

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  riskLevel: import('@/lib/constants').RiskLevel | null;
  createdAt: string;
}

export interface AiResponse {
  message: string;
  riskLevel: import('@/lib/constants').RiskLevel;
  disclaimer: string;
}
