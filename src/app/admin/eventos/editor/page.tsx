"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import { eventsRepo } from "@/lib/admin/repository";
import type { EventItem } from "@/lib/types";
import { AdminField, AdminInput, AdminTextarea, AdminToggle, AdminDateTimeInput } from "@/components/admin/AdminField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { SuccessModal } from "@/components/admin/SuccessModal";
import { button } from "@/lib/design/tokens";

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

function EventEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isNew = !id;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<Partial<EventItem>>({
    name: "",
    slug: "",
    description: "",
    cover_image: null,
    cover_alt: null,
    gallery: null,
    event_date: null,
    location: null,
    participants: null,
    theme: null,
    related_link: null,
    instagram_url: null,
    published: false,
    featured: false,
    seo_title: null,
    seo_description: null,
    seo_keyword: null,
  });

  const set = useCallback(<K extends keyof EventItem>(key: K, value: EventItem[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    if (id) {
      eventsRepo.getById(id).then((data) => {
        if (data) setForm(data);
        setLoading(false);
      });
    }
  }, [id]);

  async function handleSave() {
    setError(null);
    if (!form.name?.trim()) { setError("Nome é obrigatório."); return; }
    if (!form.slug?.trim()) { setError("Slug é obrigatório."); return; }
    if (!form.description?.trim()) { setError("Descrição é obrigatória."); return; }
    setSaving(true);
    try {
      if (isNew) {
        await eventsRepo.create(form);
      } else {
        await eventsRepo.update(id!, form);
      }
      setSuccess(true);
      setTimeout(() => router.push("/admin/eventos"), 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
      setSaving(false);
    }
  }

  if (loading) return <div className="text-sm text-muted py-8">Carregando…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push("/admin/eventos")} className={button.ghost}>
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-bold text-azul-petroleo">
            {isNew ? "Novo Evento" : "Editar Evento"}
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

      <SuccessModal open={success} message="Evento salvo com sucesso!" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <AdminField label="Nome do Evento" required>
            <AdminInput
              value={form.name ?? ""}
              onChange={(e) => { set("name", e.target.value); if (isNew) set("slug", slugify(e.target.value)); }}
              placeholder="Nome do evento"
            />
          </AdminField>

          <AdminField label="Slug" required>
            <AdminInput value={form.slug ?? ""} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="slug-do-evento" />
          </AdminField>

          <AdminField label="Descrição" required hint="Markdown ou HTML suportado.">
            <AdminTextarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Descrição do evento…" rows={14} />
          </AdminField>

          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <h3 className="text-sm font-semibold text-azul-petroleo">Carrossel de fotos</h3>
            <p className="text-xs text-muted">
              Exibidas em carrossel na página do evento. Sem fotos, o carrossel não aparece.
            </p>
            <GalleryUploader
              value={form.gallery ?? null}
              onChange={(urls) => set("gallery", urls)}
              folder="events"
            />
          </div>

          <AdminField label="Tema">
            <AdminInput value={form.theme ?? ""} onChange={(e) => set("theme", e.target.value || null)} placeholder="Tema principal do evento" />
          </AdminField>

        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <h3 className="text-sm font-semibold text-azul-petroleo">Status</h3>
            <AdminToggle label="Publicado" checked={form.published ?? false} onChange={(v) => set("published", v)} />
            <AdminToggle label="Destaque na home" checked={form.featured ?? false} onChange={(v) => set("featured", v)} />
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 space-y-4">
            <h3 className="text-sm font-semibold text-azul-petroleo">Detalhes</h3>
            <AdminField label="Data do evento" hint="Ex.: 25/06/2026 14:30 (hora opcional)">
              <AdminDateTimeInput value={form.event_date ?? null} onChange={(iso) => set("event_date", iso)} />
            </AdminField>
            <AdminField label="Local">
              <AdminInput value={form.location ?? ""} onChange={(e) => set("location", e.target.value || null)} placeholder="Teresina, PI" />
            </AdminField>
            <AdminField label="Link relacionado">
              <AdminInput type="url" value={form.related_link ?? ""} onChange={(e) => set("related_link", e.target.value || null)} placeholder="https://…" />
            </AdminField>
            <AdminField label="URL do Instagram">
              <AdminInput type="url" value={form.instagram_url ?? ""} onChange={(e) => set("instagram_url", e.target.value || null)} placeholder="https://instagram.com/p/…" />
            </AdminField>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
            <h3 className="text-sm font-semibold text-azul-petroleo">Imagem de capa</h3>
            <ImageUploader value={form.cover_image ?? null} onChange={(url) => set("cover_image", url)} folder="events" label="" />
            {form.cover_image && (
              <AdminField label="Alt text">
                <AdminInput value={form.cover_alt ?? ""} onChange={(e) => set("cover_alt", e.target.value || null)} placeholder="Descrição da imagem" />
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

export default function EventEditorPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted py-8">Carregando editor…</div>}>
      <EventEditorInner />
    </Suspense>
  );
}
