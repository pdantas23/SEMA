"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import { instagramRepo, categoriesRepo } from "@/lib/admin/repository";
import type { InstagramPost, Category } from "@/lib/types";
import { AdminField, AdminInput, AdminTextarea } from "@/components/admin/AdminField";
import { AdminDropdown, type DropdownOption } from "@/components/admin/AdminDropdown";
import { SuccessModal } from "@/components/admin/SuccessModal";
import { button } from "@/lib/design/tokens";

const RELATED_TYPE_OPTIONS: DropdownOption[] = [
  { value: "post", label: "Post / Blog" },
  { value: "news", label: "Notícia" },
  { value: "event", label: "Evento" },
];

function InstagramEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isNew = !id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<Partial<InstagramPost>>({
    url: "",
    caption: null,
    category_id: null,
    related_type: null,
    related_id: null,
  });

  const set = useCallback(<K extends keyof InstagramPost>(key: K, value: InstagramPost[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    categoriesRepo.list().then(setCategories);
    if (id) {
      instagramRepo.getById(id).then((data) => {
        if (data) setForm(data);
        setLoading(false);
      });
    }
  }, [id]);

  async function handleSave() {
    setError(null);
    if (!form.url?.trim()) { setError("URL é obrigatória."); return; }
    setSaving(true);
    try {
      if (isNew) {
        await instagramRepo.create(form);
      } else {
        await instagramRepo.update(id!, form);
      }
      // Mostra o popup de sucesso e sai da edição (volta para a lista).
      setSuccess(true);
      setTimeout(() => router.push("/admin/instagram"), 1400);
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
          <button type="button" onClick={() => router.push("/admin/instagram")} className={button.ghost}>
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-bold text-azul-petroleo">
            {isNew ? "Novo Post Instagram" : "Editar Post Instagram"}
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

      <div className="space-y-5">
        <AdminField label="URL do Post" required hint="Link do post no Instagram">
          <AdminInput
            type="url"
            value={form.url ?? ""}
            onChange={(e) => set("url", e.target.value)}
            placeholder="https://www.instagram.com/p/…"
          />
        </AdminField>

        <AdminField label="Legenda">
          <AdminTextarea
            value={form.caption ?? ""}
            onChange={(e) => set("caption", e.target.value || null)}
            placeholder="Texto do post para exibição no site…"
            rows={4}
          />
        </AdminField>

        <AdminField label="Categoria">
          <AdminDropdown
            options={categoryOptions}
            value={form.category_id ?? null}
            onChange={(v) => set("category_id", v)}
            placeholder="Sem categoria"
            clearable
          />
        </AdminField>

        <AdminField label="Conteúdo relacionado">
          <AdminDropdown
            options={RELATED_TYPE_OPTIONS}
            value={form.related_type ?? null}
            onChange={(v) => set("related_type", v as InstagramPost["related_type"])}
            placeholder="Nenhum"
            clearable
          />
        </AdminField>

        {form.related_type && (
          <AdminField
            label="ID do conteúdo relacionado"
            hint="Cole o UUID do post, notícia ou evento relacionado."
          >
            <AdminInput
              value={form.related_id ?? ""}
              onChange={(e) => set("related_id", e.target.value || null)}
              placeholder="uuid-do-conteudo"
            />
          </AdminField>
        )}
      </div>

      <SuccessModal open={success} message="Post salvo com sucesso!" />
    </div>
  );
}

export default function InstagramEditorPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted py-8">Carregando editor…</div>}>
      <InstagramEditorInner />
    </Suspense>
  );
}
