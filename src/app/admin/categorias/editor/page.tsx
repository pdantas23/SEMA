"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import { categoriesRepo } from "@/lib/admin/repository";
import type { Category } from "@/lib/types";
import { AdminField, AdminInput, AdminTextarea } from "@/components/admin/AdminField";
import { SuccessModal } from "@/components/admin/SuccessModal";
import { button } from "@/lib/design/tokens";

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

function CategoryEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isNew = !id;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<Partial<Category>>({
    name: "",
    slug: "",
    description: null,
  });

  const set = useCallback(<K extends keyof Category>(key: K, value: Category[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    if (id) {
      categoriesRepo.getById(id).then((data) => {
        if (data) setForm(data);
        setLoading(false);
      });
    }
  }, [id]);

  async function handleSave() {
    setError(null);
    if (!form.name?.trim()) { setError("Nome é obrigatório."); return; }
    if (!form.slug?.trim()) { setError("Slug é obrigatório."); return; }
    setSaving(true);
    try {
      if (isNew) {
        await categoriesRepo.create(form);
      } else {
        await categoriesRepo.update(id!, form);
      }
      setSuccess(true);
      setTimeout(() => router.push("/admin/categorias"), 1400);
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
          <button type="button" onClick={() => router.push("/admin/categorias")} className={button.ghost}>
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-bold text-azul-petroleo">
            {isNew ? "Nova Categoria" : "Editar Categoria"}
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

      <SuccessModal open={success} message="Categoria salva com sucesso!" />

      <div className="space-y-5">
        <AdminField label="Nome" required>
          <AdminInput
            value={form.name ?? ""}
            onChange={(e) => { set("name", e.target.value); if (isNew) set("slug", slugify(e.target.value)); }}
            placeholder="Direito Tributário"
          />
        </AdminField>

        <AdminField label="Slug" required hint="Identificador na URL (gerado automaticamente).">
          <AdminInput value={form.slug ?? ""} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="direito-tributario" />
        </AdminField>

        <AdminField label="Descrição">
          <AdminTextarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value || null)} placeholder="Descrição opcional da categoria" rows={4} />
        </AdminField>
      </div>
    </div>
  );
}

export default function CategoryEditorPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted py-8">Carregando editor…</div>}>
      <CategoryEditorInner />
    </Suspense>
  );
}
