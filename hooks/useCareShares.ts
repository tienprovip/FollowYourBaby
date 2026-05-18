import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { Database } from '@/types/database';

type CareShareRow = Database['public']['Tables']['care_shares']['Row'];
type CareShareInsert = Database['public']['Tables']['care_shares']['Insert'];

export interface InviteInput {
  resourceType: 'baby' | 'pregnancy';
  resourceId: string;
  permission: 'view' | 'edit' | 'full';
  inviteeEmail: string;
}

export interface ShareWithGranteeProfile extends CareShareRow {
  grantee_full_name: string | null;
  grantee_avatar_url: string | null;
}

export interface ShareWithOwnerProfile extends CareShareRow {
  owner_full_name: string | null;
  owner_avatar_url: string | null;
  owner_id: string;
  resource_name: string | null;
}

const SHARES_GRANTED_KEY = 'care_shares_granted';
const SHARES_RECEIVED_KEY = 'care_shares_received';

export function useCareShares() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  // Shares I granted to others (resources I own)
  const grantedQuery = useQuery({
    queryKey: [SHARES_GRANTED_KEY, userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('care_shares')
        .select(`
          *,
          profiles!care_shares_grantee_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data ?? []).filter((row) => {
        // Keep rows where the current user is the resource owner.
        // We filter client-side since RLS already restricts the result set to
        // rows where the user is either the resource owner or the grantee.
        return row.grantee_id !== userId;
      }) as (CareShareRow & { profiles: { full_name: string | null; avatar_url: string | null } | null })[];
    },
  });

  // Shares others granted to me (I am the grantee)
  const receivedQuery = useQuery({
    queryKey: [SHARES_RECEIVED_KEY, userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('care_shares')
        .select('*')
        .eq('grantee_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as CareShareRow[];
    },
  });

  // Create a care_share row then an invite token via Edge Function stub
  const inviteMutation = useMutation({
    mutationFn: async (input: InviteInput) => {
      // Step 1 — create or upsert care_share (grantee will be set after accept,
      // so we insert with a placeholder grantee of the inviter for now and let
      // the Edge Function create-care-invite fill in the real grantee on accept).
      // The Edge Function owns the full flow; here we call it directly.
      const { data, error } = await supabase.functions.invoke('create-care-invite', {
        body: {
          resource_type: input.resourceType,
          resource_id: input.resourceId,
          permission: input.permission,
          invitee_email: input.inviteeEmail,
        },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error as string);
      return data as { invite_token: string; care_share_id: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SHARES_GRANTED_KEY, userId] });
    },
  });

  // Accept an invite by token (called from deep link handler)
  const acceptMutation = useMutation({
    mutationFn: async (token: string) => {
      const { data, error } = await supabase.rpc('accept_care_share_invite', {
        p_token: token,
      });
      if (error) throw error;
      const result = data as { error?: string; care_share_id?: string };
      if (result?.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SHARES_RECEIVED_KEY, userId] });
    },
  });

  // Revoke (hard-delete) a share — owner only
  const revokeMutation = useMutation({
    mutationFn: async (careShareId: string) => {
      const { error } = await supabase
        .from('care_shares')
        .delete()
        .eq('id', careShareId);
      if (error) throw error;
      return careShareId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SHARES_GRANTED_KEY, userId] });
    },
  });

  return {
    sharesGranted: grantedQuery.data ?? [],
    isLoadingGranted: grantedQuery.isLoading,
    grantedError: grantedQuery.error,

    sharesReceived: receivedQuery.data ?? [],
    isLoadingReceived: receivedQuery.isLoading,
    receivedError: receivedQuery.error,

    inviteCaregiver: inviteMutation.mutateAsync,
    isInviting: inviteMutation.isPending,
    inviteError: inviteMutation.error,

    acceptInvite: acceptMutation.mutateAsync,
    isAccepting: acceptMutation.isPending,
    acceptError: acceptMutation.error,

    revokeShare: revokeMutation.mutateAsync,
    isRevoking: revokeMutation.isPending,
    revokeError: revokeMutation.error,
  };
}
