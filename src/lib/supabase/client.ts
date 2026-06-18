import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase do browser (blueprint §7).
 * App estático → sessão em localStorage (NÃO cookie), autoRefresh, singleton,
 * storageKey próprio do projeto e TTL de sessão.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const STORAGE_KEY = "sema-dashboard-auth";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 1 dia

/** Storage com TTL sobre o localStorage (expira a sessão após SESSION_TTL_MS). */
function ttlStorage(): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  return {
    getItem: (key: string) => {
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      try {
        const { value, expires } = JSON.parse(raw) as {
          value: string;
          expires: number;
        };
        if (expires && Date.now() > expires) {
          window.localStorage.removeItem(key);
          return null;
        }
        return value;
      } catch {
        return raw; // compat com valores legados
      }
    },
    setItem: (key: string, value: string) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({ value, expires: Date.now() + SESSION_TTL_MS })
      );
    },
    removeItem: (key: string) => window.localStorage.removeItem(key),
    clear: () => window.localStorage.clear(),
    key: (i: number) => window.localStorage.key(i),
    get length() {
      return window.localStorage.length;
    },
  } as Storage;
}

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storageKey: STORAGE_KEY,
      storage: ttlStorage(),
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  return _client;
}

/** true quando há credenciais configuradas (senão, modo leitura/seed sem backend). */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = getSupabase();
