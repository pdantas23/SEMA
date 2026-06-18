import { Router } from "express";
import multer from "multer";
import { db } from "../supabase";
import { requireAdmin } from "../auth";
import { STORAGE_BUCKET } from "../config";

/**
 * CRUD do admin — protegido por requireAdmin. Mapeia cada "resource" da URL
 * para a tabela _sema correspondente (espelha src/lib/admin/repository.ts).
 */
export const adminRouter = Router();

const RESOURCES: Record<string, string> = {
  posts: "posts_sema",
  news: "news_sema",
  events: "events_sema",
  areas: "areas_sema",
  team: "team_sema",
  categories: "categories_sema",
  instagram: "instagram_sema",
  leads: "leads_sema",
};

adminRouter.use(requireAdmin);

function tableFor(resource: string): string | null {
  return RESOURCES[resource] ?? null;
}

/* --------------------------------- Upload --------------------------------- */
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

adminRouter.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Arquivo ausente." });
  const folder = (req.body?.folder as string) || "uploads";
  const ext = req.file.originalname.split(".").pop() ?? "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await db.storage.from(STORAGE_BUCKET).upload(path, req.file.buffer, {
    cacheControl: "3600",
    upsert: false,
    contentType: req.file.mimetype,
  });
  if (error) return res.status(500).json({ error: error.message });

  const { data } = db.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  res.json({ path, url: data.publicUrl });
});

/* ------------------------------- List / Get ------------------------------- */
adminRouter.get("/:resource", async (req, res) => {
  const table = tableFor(req.params.resource);
  if (!table) return res.status(404).json({ error: "Recurso inválido." });

  let q = db.from(table).select("*").order("created_at", { ascending: false });

  // Filtros específicos de leads (CRM).
  if (req.params.resource === "leads") {
    const { status, etiqueta } = req.query as Record<string, string>;
    if (status && status !== "todos") q = q.eq("status_comercial", status);
    if (etiqueta && etiqueta !== "todos") q = q.eq("etiqueta", etiqueta);
  }

  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data ?? []);
});

adminRouter.get("/:resource/:id", async (req, res) => {
  const table = tableFor(req.params.resource);
  if (!table) return res.status(404).json({ error: "Recurso inválido." });
  const { data, error } = await db
    .from(table)
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data ?? null);
});

/* --------------------------------- Create --------------------------------- */
adminRouter.post("/:resource", async (req, res) => {
  const table = tableFor(req.params.resource);
  if (!table) return res.status(404).json({ error: "Recurso inválido." });
  const { data, error } = await db.from(table).insert(req.body).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

/* --------------------------- Update / Toggle ------------------------------ */
adminRouter.patch("/:resource/:id/toggle", async (req, res) => {
  const table = tableFor(req.params.resource);
  if (!table) return res.status(404).json({ error: "Recurso inválido." });
  const { field, value } = req.body ?? {};
  if (!field) return res.status(400).json({ error: "Campo ausente." });
  const { error } = await db.from(table).update({ [field]: value }).eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

adminRouter.patch("/:resource/:id", async (req, res) => {
  const table = tableFor(req.params.resource);
  if (!table) return res.status(404).json({ error: "Recurso inválido." });
  const payload = { ...req.body };
  if (req.params.resource === "posts") payload.updated_at = new Date().toISOString();
  const { data, error } = await db
    .from(table)
    .update(payload)
    .eq("id", req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/* --------------------------------- Delete --------------------------------- */
adminRouter.delete("/:resource/:id", async (req, res) => {
  const table = tableFor(req.params.resource);
  if (!table) return res.status(404).json({ error: "Recurso inválido." });
  const { error } = await db.from(table).delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});
