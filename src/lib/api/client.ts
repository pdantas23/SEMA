/**
 * Cliente HTTP do front → API (api.senma.adv.br).
 * Substitui o acesso direto ao Supabase no browser.
 *
 * - Leituras públicas: apiGet (sem auth).
 * - Operações do admin: apiAuth (Bearer token, com refresh automático).
 *
 * Base URL vem de NEXT_PUBLIC_API_URL.
 */

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export const isApiConfigured = Boolean(API_URL);

const TOKEN_KEY = "sema-admin-session";

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at?: number; // epoch (s)
}

/* ----------------------------- Token storage ----------------------------- */
export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(TOKEN_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(s: Session | null) {
  if (typeof window === "undefined") return;
  if (s) window.localStorage.setItem(TOKEN_KEY, JSON.stringify(s));
  else window.localStorage.removeItem(TOKEN_KEY);
}

/* ------------------------------ Leitura pública ----------------------------- */
/**
 * Leitura feita durante `next build` (generateMetadata / generateStaticParams).
 *
 * Precisa ser cacheável: com `no-store` o Next aborta a geração estática
 * (NEXT_STATIC_GEN_BAILOUT) e a página sai sem os dados — foi o que fazia os
 * cards de compartilhamento nascerem todos genéricos. O `prebuild` apaga
 * `.next/`, então cada build busca conteúdo fresco mesmo assim.
 */
export const BUILD_READ = { cache: "force-cache" as const };

export async function apiGet<T>(
  path: string,
  fallback: T,
  opts: { cache?: RequestCache } = {}
): Promise<T> {
  if (!API_URL) return fallback;
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      // Padrão no browser: sempre fresco. No build, passe BUILD_READ.
      cache: opts.cache ?? "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[api] GET ${path} falhou, usando fallback:`, err);
    }
    return fallback;
  }
}

/* -------------------------- Operações autenticadas -------------------------- */
async function refresh(): Promise<Session | null> {
  const s = getSession();
  if (!s?.refresh_token) return null;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: s.refresh_token }),
    });
    if (!res.ok) throw new Error("refresh falhou");
    const data = (await res.json()) as Session;
    const next = { ...s, ...data };
    setSession(next);
    return next;
  } catch {
    setSession(null);
    return null;
  }
}

async function authedFetch(
  path: string,
  init: RequestInit,
  retry = true
): Promise<Response> {
  let s = getSession();
  // Renova proativamente se faltam < 60s para expirar.
  if (s?.expires_at && s.expires_at * 1000 - Date.now() < 60_000) {
    s = (await refresh()) ?? s;
  }
  const headers = new Headers(init.headers);
  if (s?.access_token) headers.set("Authorization", `Bearer ${s.access_token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (res.status === 401 && retry) {
    const renewed = await refresh();
    if (renewed) return authedFetch(path, init, false);
  }
  return res;
}

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(json?.error ?? `HTTP ${res.status}`);
  }
  return json as T;
}

export const apiAuth = {
  get: async <T>(path: string): Promise<T> =>
    parse<T>(await authedFetch(path, { method: "GET" })),
  post: async <T>(path: string, body?: unknown): Promise<T> =>
    parse<T>(
      await authedFetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      })
    ),
  patch: async <T>(path: string, body?: unknown): Promise<T> =>
    parse<T>(
      await authedFetch(path, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      })
    ),
  del: async <T>(path: string): Promise<T> =>
    parse<T>(await authedFetch(path, { method: "DELETE" })),
  /** Upload multipart (não seta Content-Type: o browser define o boundary). */
  upload: async <T>(path: string, form: FormData): Promise<T> =>
    parse<T>(await authedFetch(path, { method: "POST", body: form })),
};

/* -------------------------------- Public POST -------------------------------- */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse<T>(res);
}
