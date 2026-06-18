"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import { newsRepo, categoriesRepo } from "@/lib/admin/repository";
import type { NewsItem, Category } from "@/lib/types";
import { AdminField, AdminInput, AdminTextarea, AdminToggle, AdminDateTimeInput } from "@/components/admin/AdminField";
import { AdminDropdown, type DropdownOption } from "@/components/admin/AdminDropdown";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { SuccessModal } from "@/components/admin/SuccessModal";
import { button } from "@/lib/design/tokens";

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

function NewsEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isNew = !id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<Partial<NewsItem>>({
    title: "",
    slug: "",
    content: "",
    cover_image: null,
    cover_alt: null,
    gallery: null,
    category_id: null,
    location: null,
    published: false,
    featured: false,
    published_at: null,
    seo_title: null,
    seo_description: null,
    seo_keyword: null,
  });

  const set = useCallback(<K extends keyof NewsItem>(key: K, value: NewsItem[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    categoriesRepo.list().then(setCategories);
    if (id) {
      newsRepo.getById(id).then((data) => {
        if (data) setForm(data);
        setLoading(false);
      });
    }
  }, [id]);

  async function handleSave() {
    setError(null);
    if (!form.title?.trim()) { setError("Título é obrigatório."); return; }
    if (!form.slug?.trim()) { setError("Slug é obrigatório."); return; }
    if (!form.content?.trim()) { setError("Conteúdo é obrigatório."); return; }
    setSaving(true);
    try {
      if (isNew) {
        await newsRepo.create(form);
      } else {
        await newsRepo.update(id!, form);
      }
      setSuccess(true);
      setTimeout(() => router.push("/admin/noticias"), 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
      setSaving(false);
    }
  }

  const categoryOptions: DropdownOption[] = categories.map((c) => ({ value: c.id, label: c.name }));

  if (loading) return <div className="text-sm text-muted py-8">Carregando…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push("/admin/noticias")} className={button.ghost}>
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-bold text-azul-petroleo">
            {isNew ? "Nova Notícia" : "Editar Notícia"}
          </h1>
        </div>
        <button type="button" onClick={handleSave} disabled={saving} className={button.primary}>
          <Save className="h-4 w-4" />
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <SuccessModal open={success} message="Notícia salva com sucesso!" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <AdminField label="Título" required>
            <AdminInput
              value={form.title ?? ""}
              onChange={(e) => { set("title", e.target.value); if (isNew) set("slug", slugify(e.target.value)); }}
              placeholder="Título da notícia"
            />
          </AdminField>

          <AdminField label="Slug" required>
            <AdminInput
              value={form.slug ?? ""}
              onChange={(e) => set("slug", slugify(e.target.value))}
              placeholder="slug-da-noticia"
            />
          </AdminField>

          <AdminField label="Conteúdo" required hint="Markdown ou HTML suportado.">
            <AdminTextarea
              value={form.content ?? ""}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Conteúdo completo da notícia…"
              rows={16}
            />
          </AdminField>

          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <h3 className="text-sm font-semibold text-azul-petroleo">Carrossel de fotos</h3>
            <p className="text-xs text-muted">
              Exibidas em carrossel na página da notícia. Sem fotos, o carrossel não aparece.
            </p>
            <GalleryUploader
              value={form.gallery ?? null}
              onChange={(urls) => set("gallery", urls)}
              folder="news"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <h3 className="text-sm font-semibold text-azul-petroleo">Status</h3>
            <AdminToggle label="Publicado" checked={form.published ?? false} onChange={(v) => set("published", v)} />
            <AdminToggle label="Destaque na home" checked={form.featured ?? false} onChange={(v) => set("featured", v)} />
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 space-y-4">
            <h3 className="text-sm font-semibold text-azul-petroleo">Metadados</h3>
            <AdminField label="Categoria">
              <AdminDropdown
                options={categoryOptions}
                value={form.category_id ?? null}
                onChange={(v) => set("category_id", v)}
                placeholder="Sem categoria"
                clearable
              />
            </AdminField>
            <AdminField label="Local">
              <AdminInput
                value={form.location ?? ""}
                onChange={(e) => set("location", e.target.value || null)}
                placeholder="Teresina, PI"
              />
            </AdminField>
            <AdminField label="Data de publicação" hint="Ex.: 25/06/2026 14:30 (hora opcional)">
              <AdminDateTimeInput
                value={form.published_at ?? null}
                onChange={(iso) => set("published_at", iso)}
              />
            </AdminField>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <h3 className="text-sm font-semibold text-azul-petroleo">Imagem de capa</h3>
            <ImageUploader
              value={form.cover_image ?? null}
              onChange={(url) => set("cover_image", url)}
              folder="news"
              label=""
            />
            {form.cover_image && (
              <AdminField label="Alt text">
                <AdminInput
                  value={form.cover_alt ?? ""}
                  onChange={(e) => set("cover_alt", e.target.value || null)}
                  placeholder="Descrição da imagem"
                />
              </AdminField>
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 space-y-4">
            <h3 className="text-sm font-semibold text-azul-petroleo">SEO</h3>
            <AdminField label="Título SEO">
              <AdminInput value={form.seo_title ?? ""} onChange={(e) => set("seo_title", e.target.value || null)} placeholder="Título SEO" maxLength={60} />
            </AdminField>
            <AdminField label="Descrição SEO">
              <AdminTextarea value={form.seo_description ?? ""} onChange={(e) => set("seo_description", e.target.value || null)} placeholder="Descrição SEO" maxLength={160} rows={3} />
            </AdminField>
            <AdminField label="Palavra-chave">
              <AdminInput value={form.seo_keyword ?? ""} onChange={(e) => set("seo_keyword", e.target.value || null)} placeholder="palavra-chave" />
            </AdminField>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewsEditorPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted py-8">Carregando editor…</div>}>
      <NewsEditorInner />
    </Suspense>
  );
}
