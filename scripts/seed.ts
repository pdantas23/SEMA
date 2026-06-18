/**
 * scripts/seed.ts — Orquestrador do seed inicial do banco SEMA_BLOG
 *
 * Uso:  npx tsx scripts/seed.ts
 * Req:  .env.local com NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
 * Idempotente: usa upsert por slug (team_sema usa name como chave).
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createAdminClient } from "../src/lib/supabase/admin";
import {
  CATEGORIES,
  POSTS,
  NEWS,
  EVENTS,
  AREAS,
  TEAM,
  INSTAGRAM,
  type CategorySeed,
  type PostSeed,
  type NewsSeed,
  type EventSeed,
  type AreaSeed,
  type TeamSeed,
  type InstagramSeed,
} from "./seed-data";

// ---------------------------------------------------------------------------
// Env loader (sem dependência externa — lê .env.local manualmente)
// ---------------------------------------------------------------------------
function loadEnv(): void {
  const envPath = resolve(process.cwd(), ".env.local");
  let raw: string;
  try {
    raw = readFileSync(envPath, "utf-8");
  } catch {
    return;
  }
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !(key in process.env)) process.env[key] = val;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
type AdminClient = ReturnType<typeof createAdminClient>;

function ok(entity: string, label: string): void {
  process.stdout.write(`  [ok] ${entity}: ${label}\n`);
}

function fail(entity: string, label: string, error: unknown): void {
  const msg =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
      ? String((error as { message: unknown }).message)
      : JSON.stringify(error);
  process.stderr.write(`  [ERRO] ${entity}: ${label} — ${msg}\n`);
  process.exitCode = 1;
}

// ---------------------------------------------------------------------------
// Seed functions
// ---------------------------------------------------------------------------
async function seedCategories(
  db: AdminClient
): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  for (const cat of CATEGORIES as CategorySeed[]) {
    const { data, error } = await db
      .from("categories_sema")
      .upsert(cat, { onConflict: "slug" })
      .select("id, slug")
      .single();
    if (error) { fail("category", cat.slug, error); continue; }
    map[data.slug] = data.id;
    ok("category", cat.slug);
  }
  return map;
}

async function seedPosts(
  db: AdminClient,
  catMap: Record<string, string>
): Promise<void> {
  for (const p of POSTS as PostSeed[]) {
    const { category_slug, ...rest } = p;
    const { error } = await db
      .from("posts_sema")
      .upsert({ ...rest, category_id: catMap[category_slug] ?? null }, { onConflict: "slug" });
    if (error) { fail("post", p.slug, error); continue; }
    ok("post", p.slug);
  }
}

async function seedNews(db: AdminClient): Promise<void> {
  for (const n of NEWS as NewsSeed[]) {
    const { error } = await db
      .from("news_sema")
      .upsert(n, { onConflict: "slug" });
    if (error) { fail("news", n.slug, error); continue; }
    ok("news", n.slug);
  }
}

async function seedEvents(db: AdminClient): Promise<void> {
  for (const e of EVENTS as EventSeed[]) {
    const { error } = await db
      .from("events_sema")
      .upsert(e, { onConflict: "slug" });
    if (error) { fail("event", e.slug, error); continue; }
    ok("event", e.slug);
  }
}

async function seedAreas(db: AdminClient): Promise<void> {
  for (const a of AREAS as AreaSeed[]) {
    const { error } = await db
      .from("areas_sema")
      .upsert(a, { onConflict: "slug" });
    if (error) { fail("area", a.slug, error); continue; }
    ok("area", a.slug);
  }
}

async function seedTeam(db: AdminClient): Promise<void> {
  for (const m of TEAM as TeamSeed[]) {
    const { data: existing } = await db
      .from("team_sema")
      .select("id")
      .eq("name", m.name)
      .maybeSingle();
    if (existing) {
      const { error } = await db.from("team_sema").update(m).eq("id", existing.id);
      if (error) { fail("team", m.name, error); continue; }
    } else {
      const { error } = await db.from("team_sema").insert(m);
      if (error) { fail("team", m.name, error); continue; }
    }
    ok("team", m.name);
  }
}

async function seedInstagram(
  db: AdminClient,
  catMap: Record<string, string>
): Promise<void> {
  for (const p of INSTAGRAM as InstagramSeed[]) {
    const { data: existing } = await db
      .from("instagram_sema")
      .select("id")
      .eq("url", p.url)
      .maybeSingle();
    if (existing) { ok("instagram (existente)", p.url); continue; }
    const { error } = await db.from("instagram_sema").insert({
      url: p.url,
      caption: p.caption,
      category_id: catMap[p.category_slug] ?? null,
    });
    if (error) { fail("instagram", p.url, error); continue; }
    ok("instagram", p.url);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  loadEnv();
  process.stdout.write("Iniciando seed SEMA_BLOG...\n");
  const db = createAdminClient();

  process.stdout.write("\nCategorias:\n");
  const catMap = await seedCategories(db);

  process.stdout.write("\nPosts:\n");
  await seedPosts(db, catMap);

  process.stdout.write("\nNoticias:\n");
  await seedNews(db);

  process.stdout.write("\nEventos:\n");
  await seedEvents(db);

  process.stdout.write("\nAreas:\n");
  await seedAreas(db);

  process.stdout.write("\nEquipe:\n");
  await seedTeam(db);

  process.stdout.write("\nInstagram:\n");
  await seedInstagram(db, catMap);

  process.stdout.write(
    process.exitCode === 1
      ? "\nSeed concluido com erros. Verifique as mensagens acima.\n"
      : "\nSeed concluido com sucesso.\n"
  );
}

main().catch((err) => {
  process.stderr.write(`Erro fatal: ${String(err)}\n`);
  process.exit(1);
});
