// ---------------------------------------------------------------------------
// Supabase database types — hand-generated from migrations/0001_init.sql
// Compatible with @supabase/supabase-js v2 (SupabaseClient<Database> pattern)
//
// Regenerate when schema changes by running (requires local Supabase instance):
//   supabase gen types typescript --local > types/database.ts
// ---------------------------------------------------------------------------

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ---------------------------------------------------------------------------
// Enum value types
// ---------------------------------------------------------------------------

export type UserRole = 'pregnant_mother' | 'parent' | 'caregiver';
export type PregnancyStatus = 'active' | 'completed' | 'lost';
export type CareShareResource = 'baby' | 'pregnancy';
export type CareSharePermission = 'view' | 'edit' | 'full';
export type PrenatalVisitType = 'checkup' | 'ultrasound' | 'test';
export type FeedType = 'breast' | 'bottle' | 'solid';
export type FeedSide = 'left' | 'right' | 'both';
export type SleepKind = 'nap' | 'night';
export type DiaperKind = 'wet' | 'dirty' | 'both';
export type SexEnum = 'male' | 'female' | 'other';
export type ActivityKind = 'tummy_time' | 'crawl' | 'walk' | 'play';
export type MilestoneCategory = 'motor' | 'language' | 'cognitive' | 'social';
export type AiMessageRole = 'user' | 'assistant' | 'system';
export type AiRiskLevel = 'green' | 'yellow' | 'red';
export type NotificationKind = 'feed' | 'sleep' | 'medication' | 'visit' | 'insight';
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'cancelled';
export type SubscriptionPlan = 'free' | 'premium' | 'family';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trialing' | 'past_due';
export type VitalKind = 'blood_pressure' | 'blood_sugar' | 'heart_rate';

// ---------------------------------------------------------------------------
// Database interface
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {

      // -----------------------------------------------------------------------
      // profiles
      // -----------------------------------------------------------------------
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole | null;
          phone: string | null;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole | null;
          phone?: string | null;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole | null;
          phone?: string | null;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // pregnancies
      // -----------------------------------------------------------------------
      pregnancies: {
        Row: {
          id: string;
          owner_id: string;
          due_date: string | null;
          lmp_date: string | null;
          status: PregnancyStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          due_date?: string | null;
          lmp_date?: string | null;
          status?: PregnancyStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          due_date?: string | null;
          lmp_date?: string | null;
          status?: PregnancyStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pregnancies_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // babies
      // -----------------------------------------------------------------------
      babies: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          dob: string;
          sex: SexEnum | null;
          birth_weight_g: number | null;
          birth_length_cm: number | null;
          photo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          dob: string;
          sex?: SexEnum | null;
          birth_weight_g?: number | null;
          birth_length_cm?: number | null;
          photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          dob?: string;
          sex?: SexEnum | null;
          birth_weight_g?: number | null;
          birth_length_cm?: number | null;
          photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'babies_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // care_shares
      // -----------------------------------------------------------------------
      care_shares: {
        Row: {
          id: string;
          resource_type: CareShareResource;
          resource_id: string;
          grantee_id: string;
          permission: CareSharePermission;
          created_at: string;
          accepted_at: string | null;
        };
        Insert: {
          id?: string;
          resource_type: CareShareResource;
          resource_id: string;
          grantee_id: string;
          permission?: CareSharePermission;
          created_at?: string;
          accepted_at?: string | null;
        };
        Update: {
          id?: string;
          resource_type?: CareShareResource;
          resource_id?: string;
          grantee_id?: string;
          permission?: CareSharePermission;
          created_at?: string;
          accepted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'care_shares_grantee_id_fkey';
            columns: ['grantee_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // baby_health_profile
      // -----------------------------------------------------------------------
      baby_health_profile: {
        Row: {
          baby_id: string;
          allergies: Json;
          medications: Json;
          medical_history: Json;
          updated_at: string;
        };
        Insert: {
          baby_id: string;
          allergies?: Json;
          medications?: Json;
          medical_history?: Json;
          updated_at?: string;
        };
        Update: {
          baby_id?: string;
          allergies?: Json;
          medications?: Json;
          medical_history?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'baby_health_profile_baby_id_fkey';
            columns: ['baby_id'];
            referencedRelation: 'babies';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // pregnancy_weights
      // -----------------------------------------------------------------------
      pregnancy_weights: {
        Row: {
          id: string;
          pregnancy_id: string;
          owner_id: string;
          recorded_at: string;
          weight_kg: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          pregnancy_id: string;
          owner_id: string;
          recorded_at?: string;
          weight_kg: number;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          pregnancy_id?: string;
          owner_id?: string;
          recorded_at?: string;
          weight_kg?: number;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pregnancy_weights_pregnancy_id_fkey';
            columns: ['pregnancy_id'];
            referencedRelation: 'pregnancies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pregnancy_weights_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // -----------------------------------------------------------------------
      // pregnancy_vitals
      // -----------------------------------------------------------------------
      pregnancy_vitals: {
        Row: {
          id: string;
          pregnancy_id: string;
          owner_id: string;
          kind: VitalKind;
          value1: number;
          value2: number | null;
          unit: string;
          recorded_at: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          pregnancy_id: string;
          owner_id: string;
          kind: VitalKind;
          value1: number;
          value2?: number | null;
          unit: string;
          recorded_at?: string;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          pregnancy_id?: string;
          owner_id?: string;
          kind?: VitalKind;
          value1?: number;
          value2?: number | null;
          unit?: string;
          recorded_at?: string;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pregnancy_vitals_pregnancy_id_fkey';
            columns: ['pregnancy_id'];
            referencedRelation: 'pregnancies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pregnancy_vitals_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // kick_counts
      // -----------------------------------------------------------------------
      kick_counts: {
        Row: {
          id: string;
          pregnancy_id: string;
          owner_id: string;
          started_at: string;
          ended_at: string | null;
          count: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          pregnancy_id: string;
          owner_id: string;
          started_at: string;
          ended_at?: string | null;
          count?: number;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          pregnancy_id?: string;
          owner_id?: string;
          started_at?: string;
          ended_at?: string | null;
          count?: number;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'kick_counts_pregnancy_id_fkey';
            columns: ['pregnancy_id'];
            referencedRelation: 'pregnancies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'kick_counts_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // pregnancy_symptoms
      // -----------------------------------------------------------------------
      pregnancy_symptoms: {
        Row: {
          id: string;
          pregnancy_id: string;
          owner_id: string;
          recorded_at: string;
          symptom_key: string;
          severity: number | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          pregnancy_id: string;
          owner_id: string;
          recorded_at?: string;
          symptom_key: string;
          severity?: number | null;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          pregnancy_id?: string;
          owner_id?: string;
          recorded_at?: string;
          symptom_key?: string;
          severity?: number | null;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pregnancy_symptoms_pregnancy_id_fkey';
            columns: ['pregnancy_id'];
            referencedRelation: 'pregnancies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pregnancy_symptoms_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // prenatal_visits
      // -----------------------------------------------------------------------
      prenatal_visits: {
        Row: {
          id: string;
          pregnancy_id: string;
          owner_id: string;
          scheduled_at: string;
          type: PrenatalVisitType;
          location: string | null;
          notes: string | null;
          document_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pregnancy_id: string;
          owner_id: string;
          scheduled_at: string;
          type?: PrenatalVisitType;
          location?: string | null;
          notes?: string | null;
          document_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pregnancy_id?: string;
          owner_id?: string;
          scheduled_at?: string;
          type?: PrenatalVisitType;
          location?: string | null;
          notes?: string | null;
          document_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'prenatal_visits_pregnancy_id_fkey';
            columns: ['pregnancy_id'];
            referencedRelation: 'pregnancies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'prenatal_visits_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // pregnancy_medications
      // -----------------------------------------------------------------------
      pregnancy_medications: {
        Row: {
          id: string;
          pregnancy_id: string;
          owner_id: string;
          name: string;
          dosage: string | null;
          schedule: Json;
          started_at: string | null;
          ended_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pregnancy_id: string;
          owner_id: string;
          name: string;
          dosage?: string | null;
          schedule?: Json;
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pregnancy_id?: string;
          owner_id?: string;
          name?: string;
          dosage?: string | null;
          schedule?: Json;
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pregnancy_medications_pregnancy_id_fkey';
            columns: ['pregnancy_id'];
            referencedRelation: 'pregnancies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pregnancy_medications_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // feed_logs
      // -----------------------------------------------------------------------
      feed_logs: {
        Row: {
          id: string;
          baby_id: string;
          owner_id: string;
          started_at: string;
          ended_at: string | null;
          type: FeedType;
          amount_ml: number | null;
          side: FeedSide | null;
          food_items: string[] | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          baby_id: string;
          owner_id: string;
          started_at: string;
          ended_at?: string | null;
          type: FeedType;
          amount_ml?: number | null;
          side?: FeedSide | null;
          food_items?: string[] | null;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          baby_id?: string;
          owner_id?: string;
          started_at?: string;
          ended_at?: string | null;
          type?: FeedType;
          amount_ml?: number | null;
          side?: FeedSide | null;
          food_items?: string[] | null;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'feed_logs_baby_id_fkey';
            columns: ['baby_id'];
            referencedRelation: 'babies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feed_logs_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // sleep_logs
      // -----------------------------------------------------------------------
      sleep_logs: {
        Row: {
          id: string;
          baby_id: string;
          owner_id: string;
          started_at: string;
          ended_at: string | null;
          kind: SleepKind;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          baby_id: string;
          owner_id: string;
          started_at: string;
          ended_at?: string | null;
          kind: SleepKind;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          baby_id?: string;
          owner_id?: string;
          started_at?: string;
          ended_at?: string | null;
          kind?: SleepKind;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sleep_logs_baby_id_fkey';
            columns: ['baby_id'];
            referencedRelation: 'babies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sleep_logs_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // diaper_logs
      // -----------------------------------------------------------------------
      diaper_logs: {
        Row: {
          id: string;
          baby_id: string;
          owner_id: string;
          recorded_at: string;
          kind: DiaperKind;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          baby_id: string;
          owner_id: string;
          recorded_at?: string;
          kind: DiaperKind;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          baby_id?: string;
          owner_id?: string;
          recorded_at?: string;
          kind?: DiaperKind;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'diaper_logs_baby_id_fkey';
            columns: ['baby_id'];
            referencedRelation: 'babies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'diaper_logs_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // growth_logs
      // -----------------------------------------------------------------------
      growth_logs: {
        Row: {
          id: string;
          baby_id: string;
          owner_id: string;
          recorded_at: string;
          weight_g: number | null;
          length_cm: number | null;
          head_cm: number | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          baby_id: string;
          owner_id: string;
          recorded_at?: string;
          weight_g?: number | null;
          length_cm?: number | null;
          head_cm?: number | null;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          baby_id?: string;
          owner_id?: string;
          recorded_at?: string;
          weight_g?: number | null;
          length_cm?: number | null;
          head_cm?: number | null;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'growth_logs_baby_id_fkey';
            columns: ['baby_id'];
            referencedRelation: 'babies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'growth_logs_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // symptom_logs
      // -----------------------------------------------------------------------
      symptom_logs: {
        Row: {
          id: string;
          baby_id: string;
          owner_id: string;
          recorded_at: string;
          fever_c: number | null;
          symptom_key: string | null;
          severity: number | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          baby_id: string;
          owner_id: string;
          recorded_at?: string;
          fever_c?: number | null;
          symptom_key?: string | null;
          severity?: number | null;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          baby_id?: string;
          owner_id?: string;
          recorded_at?: string;
          fever_c?: number | null;
          symptom_key?: string | null;
          severity?: number | null;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'symptom_logs_baby_id_fkey';
            columns: ['baby_id'];
            referencedRelation: 'babies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'symptom_logs_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // medication_logs
      // -----------------------------------------------------------------------
      medication_logs: {
        Row: {
          id: string;
          baby_id: string;
          owner_id: string;
          name: string;
          dosage: string | null;
          given_at: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          baby_id: string;
          owner_id: string;
          name: string;
          dosage?: string | null;
          given_at?: string;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          baby_id?: string;
          owner_id?: string;
          name?: string;
          dosage?: string | null;
          given_at?: string;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'medication_logs_baby_id_fkey';
            columns: ['baby_id'];
            referencedRelation: 'babies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'medication_logs_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // activity_logs
      // -----------------------------------------------------------------------
      activity_logs: {
        Row: {
          id: string;
          baby_id: string;
          owner_id: string;
          recorded_at: string;
          kind: ActivityKind;
          duration_min: number | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          baby_id: string;
          owner_id: string;
          recorded_at?: string;
          kind: ActivityKind;
          duration_min?: number | null;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          baby_id?: string;
          owner_id?: string;
          recorded_at?: string;
          kind?: ActivityKind;
          duration_min?: number | null;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'activity_logs_baby_id_fkey';
            columns: ['baby_id'];
            referencedRelation: 'babies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'activity_logs_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // milestones
      // -----------------------------------------------------------------------
      milestones: {
        Row: {
          id: string;
          baby_id: string;
          owner_id: string;
          key: string;
          category: MilestoneCategory;
          achieved_at: string | null;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          baby_id: string;
          owner_id: string;
          key: string;
          category: MilestoneCategory;
          achieved_at?: string | null;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          baby_id?: string;
          owner_id?: string;
          key?: string;
          category?: MilestoneCategory;
          achieved_at?: string | null;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'milestones_baby_id_fkey';
            columns: ['baby_id'];
            referencedRelation: 'babies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'milestones_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // milestone_catalog
      // -----------------------------------------------------------------------
      milestone_catalog: {
        Row: {
          key: string;
          category: MilestoneCategory;
          age_min_months: number;
          age_max_months: number;
          title_vi: string;
          description_vi: string;
        };
        Insert: {
          key: string;
          category: MilestoneCategory;
          age_min_months: number;
          age_max_months: number;
          title_vi: string;
          description_vi: string;
        };
        Update: {
          key?: string;
          category?: MilestoneCategory;
          age_min_months?: number;
          age_max_months?: number;
          title_vi?: string;
          description_vi?: string;
        };
        Relationships: [];
      };

      // -----------------------------------------------------------------------
      // articles
      // -----------------------------------------------------------------------
      articles: {
        Row: {
          id: string;
          slug: string;
          title_vi: string;
          body_md_vi: string;
          tags: string[];
          age_min_months: number | null;
          age_max_months: number | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title_vi: string;
          body_md_vi: string;
          tags?: string[];
          age_min_months?: number | null;
          age_max_months?: number | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title_vi?: string;
          body_md_vi?: string;
          tags?: string[];
          age_min_months?: number | null;
          age_max_months?: number | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      // -----------------------------------------------------------------------
      // ai_conversations
      // -----------------------------------------------------------------------
      ai_conversations: {
        Row: {
          id: string;
          owner_id: string;
          baby_id: string | null;
          pregnancy_id: string | null;
          title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          baby_id?: string | null;
          pregnancy_id?: string | null;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          baby_id?: string | null;
          pregnancy_id?: string | null;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_conversations_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ai_conversations_baby_id_fkey';
            columns: ['baby_id'];
            referencedRelation: 'babies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ai_conversations_pregnancy_id_fkey';
            columns: ['pregnancy_id'];
            referencedRelation: 'pregnancies';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // ai_messages
      // -----------------------------------------------------------------------
      ai_messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: AiMessageRole;
          content: string;
          risk_level: AiRiskLevel | null;
          citations: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: AiMessageRole;
          content: string;
          risk_level?: AiRiskLevel | null;
          citations?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: AiMessageRole;
          content?: string;
          risk_level?: AiRiskLevel | null;
          citations?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_messages_conversation_id_fkey';
            columns: ['conversation_id'];
            referencedRelation: 'ai_conversations';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // ai_memory
      // -----------------------------------------------------------------------
      ai_memory: {
        Row: {
          id: string;
          owner_id: string;
          baby_id: string | null;
          pregnancy_id: string | null;
          key: string;
          value: Json;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          baby_id?: string | null;
          pregnancy_id?: string | null;
          key: string;
          value?: Json;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          baby_id?: string | null;
          pregnancy_id?: string | null;
          key?: string;
          value?: Json;
          source?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_memory_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ai_memory_baby_id_fkey';
            columns: ['baby_id'];
            referencedRelation: 'babies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ai_memory_pregnancy_id_fkey';
            columns: ['pregnancy_id'];
            referencedRelation: 'pregnancies';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // notification_schedules
      // -----------------------------------------------------------------------
      notification_schedules: {
        Row: {
          id: string;
          owner_id: string;
          kind: NotificationKind;
          payload: Json;
          scheduled_at: string;
          sent_at: string | null;
          status: NotificationStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          kind: NotificationKind;
          payload?: Json;
          scheduled_at: string;
          sent_at?: string | null;
          status?: NotificationStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          kind?: NotificationKind;
          payload?: Json;
          scheduled_at?: string;
          sent_at?: string | null;
          status?: NotificationStatus;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_schedules_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // expo_push_tokens
      // -----------------------------------------------------------------------
      expo_push_tokens: {
        Row: {
          id: string;
          owner_id: string;
          token: string;
          device_info: Json;
          last_seen_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          token: string;
          device_info?: Json;
          last_seen_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          token?: string;
          device_info?: Json;
          last_seen_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'expo_push_tokens_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

      // -----------------------------------------------------------------------
      // subscriptions
      // -----------------------------------------------------------------------
      subscriptions: {
        Row: {
          id: string;
          owner_id: string;
          plan: SubscriptionPlan;
          status: SubscriptionStatus;
          started_at: string;
          expires_at: string | null;
          provider: string | null;
          provider_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          plan?: SubscriptionPlan;
          status?: SubscriptionStatus;
          started_at?: string;
          expires_at?: string | null;
          provider?: string | null;
          provider_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          plan?: SubscriptionPlan;
          status?: SubscriptionStatus;
          started_at?: string;
          expires_at?: string | null;
          provider?: string | null;
          provider_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };

    }; // end Tables

    Views: Record<string, never>;

    Functions: {
      has_resource_access: {
        Args: {
          p_resource_type: string;
          p_resource_id: string;
          p_min_perm: string;
        };
        Returns: boolean;
      };
      permission_gte: {
        Args: {
          stored: string;
          required: string;
        };
        Returns: boolean;
      };
    };

    Enums: {
      user_role: UserRole;
      pregnancy_status: PregnancyStatus;
      care_share_resource: CareShareResource;
      care_share_permission: CareSharePermission;
      prenatal_visit_type: PrenatalVisitType;
      feed_type: FeedType;
      feed_side: FeedSide;
      sleep_kind: SleepKind;
      diaper_kind: DiaperKind;
      sex_enum: SexEnum;
      activity_kind: ActivityKind;
      milestone_category: MilestoneCategory;
      ai_message_role: AiMessageRole;
      ai_risk_level: AiRiskLevel;
      notification_kind: NotificationKind;
      notification_status: NotificationStatus;
      subscription_plan: SubscriptionPlan;
      subscription_status: SubscriptionStatus;
    };

    CompositeTypes: Record<string, never>;
  }; // end public
}

// ---------------------------------------------------------------------------
// Convenience re-exports for feature agents
// ---------------------------------------------------------------------------

// Helper to extract Row types by table name
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];
