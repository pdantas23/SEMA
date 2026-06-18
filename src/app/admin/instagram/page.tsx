"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, ExternalLink } from "lucide-react";
import { instagramRepo } from "@/lib/admin/repository";
import type { InstagramPost } from "@/lib/types";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { button } from "@/lib/design/tokens";

export default function InstagramListPage() {
  const [items, setItems] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<InstagramPost | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await instagramRepo.list()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await instagramRepo.remove(deleteTarget.id); setDeleteTarget(null); await load(); }
    finally { setDeleting(false); }
  }

  const columns: Column<InstagramPost>[] = [
    {
      key: "url",
      label: "URL",
      render: (p) => (
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-azul-lavanda hover:underline text-xs"
        >
          {p.url.length > 50 ? p.url.slice(0, 50) + "…" : p.url}
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      ),
    },
    {
      key: "caption",
      label: "Legenda",
      render: (p) => (
        <span className="text-xs text-muted line-clamp-2">{p.caption ?? "—"}</span>
      ),
    },
    {
      key: "related_type",
      label: "Tipo",
      render: (p) => (
        <span className="rounded-full bg-azul-claro/10 px-2 py-0.5 text-xs text-azul-petroleo font-medium">
          {p.related_type ?? "—"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Adicionado",
      render: (p) => (
        <span className="text-xs text-muted">{new Date(p.created_at).toLocaleDateString("pt-BR")}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-azul-petroleo">Instagram</h1>
          <p className="text-sm text-muted">{items.length} posts vinculados</p>
        </div>
        <button className={button.primary} onClick={() => router.push("/admin/instagram/editor")}>
          <Plus className="h-4 w-4" />
          Novo Post
        </button>
      </div>

      <AdminTable
        columns={columns}
        rows={items}
        loading={loading}
        onEdit={(p) => router.push(`/admin/instagram/editor?id=${p.id}`)}
        onDelete={setDeleteTarget}
        emptyMessage="Nenhum post do Instagram cadastrado ainda."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        message="Excluir este post do Instagram do banco de dados?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
