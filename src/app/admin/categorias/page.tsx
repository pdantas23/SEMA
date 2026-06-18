"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { categoriesRepo } from "@/lib/admin/repository";
import type { Category } from "@/lib/types";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { button } from "@/lib/design/tokens";

export default function CategoriasListPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await categoriesRepo.list()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await categoriesRepo.remove(deleteTarget.id); setDeleteTarget(null); await load(); }
    finally { setDeleting(false); }
  }

  const columns: Column<Category>[] = [
    {
      key: "name",
      label: "Nome",
      render: (c) => <span className="font-medium text-azul-petroleo">{c.name}</span>,
    },
    {
      key: "slug",
      label: "Slug",
      render: (c) => <span className="text-xs text-muted font-mono">{c.slug}</span>,
    },
    {
      key: "description",
      label: "Descrição",
      render: (c) => <span className="text-xs text-muted">{c.description ?? "—"}</span>,
    },
    {
      key: "created_at",
      label: "Criado em",
      render: (c) => (
        <span className="text-xs text-muted">{new Date(c.created_at).toLocaleDateString("pt-BR")}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-azul-petroleo">Categorias</h1>
          <p className="text-sm text-muted">{items.length} registros</p>
        </div>
        <button className={button.primary} onClick={() => router.push("/admin/categorias/editor")}>
          <Plus className="h-4 w-4" />
          Nova Categoria
        </button>
      </div>

      <AdminTable
        columns={columns}
        rows={items}
        loading={loading}
        onEdit={(c) => router.push(`/admin/categorias/editor?id=${c.id}`)}
        onDelete={setDeleteTarget}
        emptyMessage="Nenhuma categoria cadastrada ainda."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Excluir a categoria "${deleteTarget?.name}"? Posts associados ficarão sem categoria.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
