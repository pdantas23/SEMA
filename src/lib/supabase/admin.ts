import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente service-role — APENAS em scripts/Node (seed, migrations utilitárias).
 * NUNCA importar no client (blueprint §7). A service role key não tem prefixo
 * NEXT_PUBLIC_ de propósito: não deve vazar para o bundle do browser.
 */
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (typeof window !== "undefined") {
    throw new Error("admin.ts não pode ser usado no browser.");
  }
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY / URL ausentes — configure o .env.local para scripts."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
