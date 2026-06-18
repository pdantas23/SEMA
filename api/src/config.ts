import dotenv from "dotenv";

// Dev local: carrega .env.development.local (precedência) e .env (fallback).
// dotenv não sobrescreve variáveis já definidas, então em PRODUÇÃO (EasyPanel),
// onde as envs são injetadas direto e não há arquivo, isto é um no-op seguro.
dotenv.config({ path: ".env.development.local" });
dotenv.config();

/** Domínio raiz do projeto (ex.: sema.adv.br). */
export const APP_DOMAIN = process.env.APP_DOMAIN ?? "sema.adv.br";

/** URL pública do site (front estático na Hostinger). */
export const SITE_URL = process.env.SITE_URL ?? `https://${APP_DOMAIN}`;

/**
 * Origens liberadas no CORS. Por padrão: o domínio raiz + www.
 * Pode sobrescrever com ALLOWED_ORIGINS="https://a.com,https://b.com".
 * Em dev, http://localhost:3000 é sempre permitido.
 */
export const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ??
  `https://${APP_DOMAIN},https://www.${APP_DOMAIN}`
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean)
  .concat(["http://localhost:3000", "http://localhost:3001"]);

export const PORT = Number(process.env.PORT ?? 3001);

export const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** Bucket de mídia (uploads do admin). */
export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "sema-media";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // Não derruba o processo (health check ainda responde), mas avisa alto.
  console.warn(
    "[config] SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY ausentes — a API não conseguirá acessar o banco."
  );
}
