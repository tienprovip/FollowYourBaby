// JWT-scoped Supabase client factory.
// Always pass the user's Authorization header so RLS enforces ownership.
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface AuthedClients {
  userClient: SupabaseClient;
  adminClient: SupabaseClient;
  userId: string;
}

export async function buildAuthedClients(req: Request): Promise<AuthedClients | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });

  const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return null;

  return { userClient, adminClient, userId: user.id };
}
