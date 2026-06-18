"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { newsRepo } from "@/lib/admin/repository";
import type { NewsItem } from "@/lib/types";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { AdminToggle } from "@/components/admin/AdminField";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { button } from "@/lib/design/tokens";

export default function NoticiasListPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await newsRepo.list()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Atualização otimista: alterna o estado local na hora e persiste em segundo
  // plano (sem recarregar a lista inteira, que causava o "piscar" da tela).
  async function handleTogglePublished(item: NewsItem) {
    const next = !item.published;
    setItems((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, published: next } : n))
    );
    try {
      await newsRepo.togglePublished(item.id, next);
    } catch {
      setItems((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, published: item.published } : n))
      );
    }
  }

  async function handleToggleFeatured(item: NewsItem) {
    const next = !item.featured;
    setItems((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, featured: next } : n))
    );
    try {
      await newsRepo.toggleFeatured(item.id, next);
    } catch {
      setItems((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, featured: item.featured } : n))
      );
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await newsRepo.remove(deleteTarget.id); setDeleteTarget(null); await load(); }
    finally { setDeleting(false); }
  }

  const columns: Column<NewsItem>[] = [
    {
      key: "title",
      label: "Título",
      render: (n) => (
        <div>
          <div className="font-medium text-azul-petroleo line-clamp-1">{n.title}</div>
          <div className="text-xs text-muted">{n.slug}</div>
        </div>
      ),
    },
    {
      key: "location",
      label: "Local",
      render: (n) => <span className="text-muted text-xs">{n.location ?? "—"}</span>,
    },
    {
      key: "published",
      label: "Publicado",
      render: (n) => (
        <AdminToggle label="" checked={n.published} onChange={() => handleTogglePublished(n)} />
      ),
    },
    {
      key: "featured",
      label: "Destaque",
      render: (n) => (
        <AdminToggle label="" checked={n.featured} onChange={() => handleToggleFeatured(n)} />
      ),
    },
    {
      key: "created_at",
      label: "Criado em",
      render: (n) => (
        <span className="text-xs text-muted">{new Date(n.created_at).toLocaleDateString("pt-BR")}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-azul-petroleo">Notícias</h1>
          <p className="text-sm text-muted">{items.length} registros</p>
        </div>
        <button className={button.primary} onClick={() => router.push("/admin/noticias/editor")}>
          <Plus className="h-4 w-4" />
          Nova Notícia
        </button>
      </div>

      <AdminTable
        columns={columns}
        rows={items}
        loading={loading}
        onEdit={(n) => router.push(`/admin/noticias/editor?id=${n.id}`)}
        onDelete={setDeleteTarget}
        emptyMessage="Nenhuma notícia cadastrada ainda."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Excluir permanentemente "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
