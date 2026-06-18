"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import { postsRepo, categoriesRepo } from "@/lib/admin/repository";
import type { Post, Category } from "@/lib/types";
import { AdminField, AdminInput, AdminTextarea, AdminToggle, AdminDateTimeInput } from "@/components/admin/AdminField";
import { AdminDropdown, type DropdownOption } from "@/components/admin/AdminDropdown";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SuccessModal } from "@/components/admin/SuccessModal";
import { button } from "@/lib/design/tokens";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function PostEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isNew = !id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<Partial<Post>>({
    title: "",
    subtitle: null,
    slug: "",
    excerpt: null,
    content: "",
    cover_image: null,
    cover_alt: null,
    category_id: null,
    author: null,
    tags: null,
    instagram_url: null,
    published: false,
    featured: false,
    published_at: null,
    seo_title: null,
    seo_description: null,
    seo_keyword: null,
  });

  const set = useCallback(<K extends keyof Post>(key: K, value: Post[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    categoriesRepo.list().then(setCategories);
    if (id) {
      postsRepo.getById(id).then((data) => {
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
        await postsRepo.create(form);
      } else {
        await postsRepo.update(id!, form);
      }
      setSuccess(true);
      setTimeout(() => router.push("/admin/posts"), 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
      setSaving(false);
    }
  }

  const categoryOptions: DropdownOption[] = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  if (loading) {
    return <div className="text-sm text-muted py-8">Carregando…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push("/admin/posts")} className={button.ghost}>
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-azul-petroleo">
              {isNew ? "Novo Post" : "Editar Post"}
            </h1>
          </div>
        </div>
        <button type="button" onClick={handleSave} disabled={saving} className={button.primary}>
          <Save className="h-4 w-4" />
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <SuccessModal open={success} message="Post salvo com sucesso!" />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <AdminField label="Título" required>
            <AdminInput
              value={form.title ?? ""}
              onChange={(e) => {
                set("title", e.target.value);
                if (isNew) set("slug", slugify(e.target.value));
              }}
              placeholder="Título do post"
            />
          </AdminField>

          <AdminField label="Subtítulo">
            <AdminInput
              value={form.subtitle ?? ""}
              onChange={(e) => set("subtitle", e.target.value || null)}
              placeholder="Subtítulo opcional"
            />
          </AdminField>

          <AdminField label="Slug" required hint="Identificador único na URL (ex.: direito-tributario-2025)">
            <AdminInput
              value={form.slug ?? ""}
              onChange={(e) => set("slug", slugify(e.target.value))}
              placeholder="slug-do-post"
            />
          </AdminField>

          <AdminField label="Resumo (excerpt)">
            <AdminTextarea
              value={form.excerpt ?? ""}
              onChange={(e) => set("excerpt", e.target.value || null)}
              placeholder="Breve descrição exibida nas listagens"
              rows={3}
            />
          </AdminField>

          <AdminField
            label="Conteúdo"
            required
            hint="Suporta Markdown ou HTML. Use ## para subtítulos, **negrito**, *itálico*."
          >
            <AdminTextarea
              value={form.content ?? ""}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Conteúdo completo do post…"
              rows={18}
            />
          </AdminField>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status toggles */}
          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <h3 className="text-sm font-semibold text-azul-petroleo">Status</h3>
            <AdminToggle
              label="Publicado"
              checked={form.published ?? false}
              onChange={(v) => set("published", v)}
            />
            <AdminToggle
              label="Destaque na home"
              checked={form.featured ?? false}
              onChange={(v) => set("featured", v)}
            />
          </div>

          {/* Metadata */}
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

            <AdminField label="Autor">
              <AdminInput
                value={form.author ?? ""}
                onChange={(e) => set("author", e.target.value || null)}
                placeholder="Nome do autor"
              />
            </AdminField>

            <AdminField label="Tags" hint="Separadas por vírgula">
              <AdminInput
                value={form.tags?.join(", ") ?? ""}
                onChange={(e) =>
                  set(
                    "tags",
                    e.target.value
                      ? e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                      : null
                  )
                }
                placeholder="direito, tributário, empresa"
              />
            </AdminField>

            <AdminField label="URL do Instagram">
              <AdminInput
                type="url"
                value={form.instagram_url ?? ""}
                onChange={(e) => set("instagram_url", e.target.value || null)}
                placeholder="https://instagram.com/p/…"
              />
            </AdminField>

            <AdminField label="Data de publicação" hint="Ex.: 25/06/2026 14:30 (hora opcional)">
              <AdminDateTimeInput
                value={form.published_at ?? null}
                onChange={(iso) => set("published_at", iso)}
              />
            </AdminField>
          </div>

          {/* Cover image */}
          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <h3 className="text-sm font-semibold text-azul-petroleo">Imagem de capa</h3>
            <ImageUploader
              value={form.cover_image ?? null}
              onChange={(url) => set("cover_image", url)}
              folder="posts"
              label=""
            />
            {form.cover_image && (
              <AdminField label="Alt text da imagem">
                <AdminInput
                  value={form.cover_alt ?? ""}
                  onChange={(e) => set("cover_alt", e.target.value || null)}
                  placeholder="Descrição da imagem para acessibilidade"
                />
              </AdminField>
            )}
          </div>

          {/* SEO */}
          <div className="rounded-xl border border-border bg-surface p-4 space-y-4">
            <h3 className="text-sm font-semibold text-azul-petroleo">SEO</h3>
            <AdminField label="Título SEO">
              <AdminInput
                value={form.seo_title ?? ""}
                onChange={(e) => set("seo_title", e.target.value || null)}
                placeholder="Título para buscadores (max 60 chars)"
                maxLength={60}
              />
            </AdminField>
            <AdminField label="Descrição SEO">
              <AdminTextarea
                value={form.seo_description ?? ""}
                onChange={(e) => set("seo_description", e.target.value || null)}
                placeholder="Descrição para buscadores (max 160 chars)"
                maxLength={160}
                rows={3}
              />
            </AdminField>
            <AdminField label="Palavra-chave principal">
              <AdminInput
                value={form.seo_keyword ?? ""}
                onChange={(e) => set("seo_keyword", e.target.value || null)}
                placeholder="direito tributário"
              />
            </AdminField>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PostEditorPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted py-8">Carregando editor…</div>}>
      <PostEditorInner />
    </Suspense>
  );
}
