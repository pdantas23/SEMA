import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
} from "./config";

/**
 * Cliente service-role — bypassa RLS. NUNCA exposto ao browser; vive só na API.
 * É por aqui que toda a leitura/escrita de dados acontece.
 */
export const db: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

/**
 * Cliente anon — usado apenas para autenticação (signIn/refresh).
 * Não acessa dados (RLS continua valendo nele).
 */
export const authClient: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
