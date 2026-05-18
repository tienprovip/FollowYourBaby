import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteRequestBody {
  resource_type: 'baby' | 'pregnancy';
  resource_id: string;
  permission: 'view' | 'edit' | 'full';
  invitee_email: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Thiếu thông tin xác thực.' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Client with user context for ownership checks (RLS enforced)
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    // Service-role client for inserting invite token (bypasses RLS on invite insert
    // so the token can be read back; all security is enforced via the ownership
    // check on care_shares before this point)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Không tìm thấy người dùng.' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json() as InviteRequestBody;
    const { resource_type, resource_id, permission, invitee_email } = body;

    if (!resource_type || !resource_id || !permission || !invitee_email) {
      return new Response(JSON.stringify({ error: 'Thiếu thông tin bắt buộc.' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Verify caller owns the resource
    let ownerCheck: { count: number | null } | null = null;
    if (resource_type === 'baby') {
      const { count } = await userClient
        .from('babies')
        .select('id', { count: 'exact', head: true })
        .eq('id', resource_id)
        .eq('owner_id', user.id)
        .single();
      ownerCheck = { count };
    } else {
      const { count } = await userClient
        .from('pregnancies')
        .select('id', { count: 'exact', head: true })
        .eq('id', resource_id)
        .eq('owner_id', user.id)
        .single();
      ownerCheck = { count };
    }

    if (!ownerCheck?.count) {
      return new Response(JSON.stringify({ error: 'Bạn không có quyền chia sẻ tài nguyên này.' }), {
        status: 403,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Upsert care_share — use a temporary placeholder grantee_id equal to owner
    // so the row satisfies the FK. On accept, the grantee_id is updated to the
    // real acceptor. NOTE: in a real flow we would look up the invitee by email
    // first; for now we create the share with owner as temporary grantee so the
    // invite token can reference a valid care_share row.
    const { data: existingShare } = await adminClient
      .from('care_shares')
      .select('id')
      .eq('resource_type', resource_type)
      .eq('resource_id', resource_id)
      .eq('grantee_id', user.id)
      .maybeSingle();

    let careShareId: string;

    if (existingShare?.id) {
      // Update permission if share already exists for this placeholder
      await adminClient
        .from('care_shares')
        .update({ permission })
        .eq('id', existingShare.id);
      careShareId = existingShare.id;
    } else {
      const { data: newShare, error: shareError } = await adminClient
        .from('care_shares')
        .insert({
          resource_type,
          resource_id,
          grantee_id: user.id,
          permission,
        })
        .select('id')
        .single();
      if (shareError) throw shareError;
      careShareId = newShare.id;
    }

    // Create invite token
    const { data: invite, error: inviteError } = await adminClient
      .from('care_share_invites')
      .insert({
        care_share_id: careShareId,
        invitee_email,
      })
      .select('token')
      .single();

    if (inviteError) throw inviteError;

    // --- Notification dispatch stub ---
    // TODO: Integrate with email/SMS provider (e.g. Resend, Twilio).
    // The deep link the invitee needs to open:
    // followyourbaby://invite/<token>
    const deepLink = `followyourbaby://invite/${invite.token}`;
    console.log(`[create-care-invite] STUB: Send invite to ${invitee_email} → ${deepLink}`);

    return new Response(
      JSON.stringify({ care_share_id: careShareId, invite_token: invite.token }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi không xác định.';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
