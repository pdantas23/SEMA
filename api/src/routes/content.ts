import { Router } from "express";
import { db } from "../supabase";

/**
 * Leitura pública de conteúdo (somente published=true).
 * Espelha src/lib/data/content.ts do front. Sem autenticação.
 */
export const contentRouter = Router();

function fail(res: import("express").Response, err: unknown) {
  return res.status(500).json({ error: (err as Error).message ?? "Erro interno" });
}

/* ---------------------------- Categorias ---------------------------- */
contentRouter.get("/categories", async (_req, res) => {
  const { data, error } = await db.from("categories_sema").select("*").order("name");
  if (error) return fail(res, error);
  res.json(data ?? []);
});

/* -------------------------------- Blog -------------------------------- */
contentRouter.get("/posts", async (req, res) => {
  const { category, search, limit, offset } = req.query as Record<string, string>;
  let q = db
    .from("posts_sema")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (category) q = q.eq("category_id", category);
  if (search) q = q.ilike("title", `%${search}%`);
  if (limit) {
    const from = Number(offset ?? 0);
    q = q.range(from, from + Number(limit) - 1);
  }
  const { data, error } = await q;
  if (error) return fail(res, error);
  res.json(data ?? []);
});

contentRouter.get("/posts/featured", async (req, res) => {
  const limit = Number((req.query.limit as string) ?? 3);
  const { data, error } = await db
    .from("posts_sema")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) return fail(res, error);
  res.json(data ?? []);
});

contentRouter.get("/posts/slugs", async (_req, res) => {
  const { data, error } = await db
    .from("posts_sema")
    .select("slug")
    .eq("published", true);
  if (error) return fail(res, error);
  res.json((data ?? []).map((r: { slug: string }) => r.slug));
});

contentRouter.get("/posts/related", async (req, res) => {
  const { categoryId, exclude, limit } = req.query as Record<string, string>;
  let q = db
    .from("posts_sema")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(Number(limit ?? 3));
  if (exclude) q = q.neq("slug", exclude);
  if (categoryId) q = q.eq("category_id", categoryId);
  const { data, error } = await q;
  if (error) return fail(res, error);
  res.json(data ?? []);
});

contentRouter.get("/posts/slug/:slug", async (req, res) => {
  const { data, error } = await db
    .from("posts_sema")
    .select("*")
    .eq("slug", req.params.slug)
    .eq("published", true)
    .maybeSingle();
  if (error) return fail(res, error);
  res.json(data ?? null);
});

/* ------------------------------ Notícias ------------------------------ */
contentRouter.get("/news", async (req, res) => {
  let q = db
    .from("news_sema")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false });
  if (req.query.limit) q = q.limit(Number(req.query.limit));
  const { data, error } = await q;
  if (error) return fail(res, error);
  res.json(data ?? []);
});

contentRouter.get("/news/slugs", async (_req, res) => {
  const { data, error } = await db
    .from("news_sema")
    .select("slug")
    .eq("published", true);
  if (error) return fail(res, error);
  res.json((data ?? []).map((r: { slug: string }) => r.slug));
});

contentRouter.get("/news/slug/:slug", async (req, res) => {
  const { data, error } = await db
    .from("news_sema")
    .select("*")
    .eq("slug", req.params.slug)
    .eq("published", true)
    .maybeSingle();
  if (error) return fail(res, error);
  res.json(data ?? null);
});

/* ------------------------------- Eventos ------------------------------- */
contentRouter.get("/events", async (req, res) => {
  let q = db
    .from("events_sema")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("event_date", { ascending: false });
  if (req.query.limit) q = q.limit(Number(req.query.limit));
  const { data, error } = await q;
  if (error) return fail(res, error);
  res.json(data ?? []);
});

contentRouter.get("/events/slugs", async (_req, res) => {
  const { data, error } = await db
    .from("events_sema")
    .select("slug")
    .eq("published", true);
  if (error) return fail(res, error);
  res.json((data ?? []).map((r: { slug: string }) => r.slug));
});

contentRouter.get("/events/slug/:slug", async (req, res) => {
  const { data, error } = await db
    .from("events_sema")
    .select("*")
    .eq("slug", req.params.slug)
    .eq("published", true)
    .maybeSingle();
  if (error) return fail(res, error);
  res.json(data ?? null);
});

/* ---------------------------- Áreas / Equipe ---------------------------- */
contentRouter.get("/areas", async (_req, res) => {
  const { data, error } = await db
    .from("areas_sema")
    .select("*")
    .eq("published", true)
    .order("order");
  if (error) return fail(res, error);
  res.json(data ?? []);
});

contentRouter.get("/areas/slug/:slug", async (req, res) => {
  const { data, error } = await db
    .from("areas_sema")
    .select("*")
    .eq("slug", req.params.slug)
    .maybeSingle();
  if (error) return fail(res, error);
  res.json(data ?? null);
});

contentRouter.get("/team", async (_req, res) => {
  const { data, error } = await db
    .from("team_sema")
    .select("*")
    .eq("published", true)
    .order("order");
  if (error) return fail(res, error);
  res.json(data ?? []);
});

/* ------------------------------ Instagram ------------------------------ */
contentRouter.get("/instagram", async (req, res) => {
  let q = db
    .from("instagram_sema")
    .select("*")
    .order("created_at", { ascending: false });
  if (req.query.limit) q = q.limit(Number(req.query.limit));
  const { data, error } = await q;
  if (error) return fail(res, error);
  res.json(data ?? []);
});
