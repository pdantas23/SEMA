"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { eventsRepo } from "@/lib/admin/repository";
import type { EventItem } from "@/lib/types";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { AdminToggle } from "@/components/admin/AdminField";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { button } from "@/lib/design/tokens";

export default function EventosListPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await eventsRepo.list()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Atualização otimista: alterna o estado local na hora e persiste em segundo
  // plano (sem recarregar a lista inteira, que causava o "piscar" da tela).
  async function handleTogglePublished(item: EventItem) {
    const next = !item.published;
    setItems((prev) =>
      prev.map((e) => (e.id === item.id ? { ...e, published: next } : e))
    );
    try {
      await eventsRepo.togglePublished(item.id, next);
    } catch {
      setItems((prev) =>
        prev.map((e) => (e.id === item.id ? { ...e, published: item.published } : e))
      );
    }
  }

  async function handleToggleFeatured(item: EventItem) {
    const next = !item.featured;
    setItems((prev) =>
      prev.map((e) => (e.id === item.id ? { ...e, featured: next } : e))
    );
    try {
      await eventsRepo.toggleFeatured(item.id, next);
    } catch {
      setItems((prev) =>
        prev.map((e) => (e.id === item.id ? { ...e, featured: item.featured } : e))
      );
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await eventsRepo.remove(deleteTarget.id); setDeleteTarget(null); await load(); }
    finally { setDeleting(false); }
  }

  const columns: Column<EventItem>[] = [
    {
      key: "name",
      label: "Nome",
      render: (e) => (
        <div>
          <div className="font-medium text-azul-petroleo line-clamp-1">{e.name}</div>
          <div className="text-xs text-muted">{e.slug}</div>
        </div>
      ),
    },
    {
      key: "event_date",
      label: "Data",
      render: (e) => (
        <span className="text-xs text-muted">
          {e.event_date ? new Date(e.event_date).toLocaleDateString("pt-BR") : "—"}
        </span>
      ),
    },
    {
      key: "location",
      label: "Local",
      render: (e) => <span className="text-xs text-muted">{e.location ?? "—"}</span>,
    },
    {
      key: "published",
      label: "Publicado",
      render: (e) => (
        <AdminToggle label="" checked={e.published} onChange={() => handleTogglePublished(e)} />
      ),
    },
    {
      key: "featured",
      label: "Destaque",
      render: (e) => (
        <AdminToggle label="" checked={e.featured} onChange={() => handleToggleFeatured(e)} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-azul-petroleo">Eventos</h1>
          <p className="text-sm text-muted">{items.length} registros</p>
        </div>
        <button className={button.primary} onClick={() => router.push("/admin/eventos/editor")}>
          <Plus className="h-4 w-4" />
          Novo Evento
        </button>
      </div>

      <AdminTable
        columns={columns}
        rows={items}
        loading={loading}
        onEdit={(e) => router.push(`/admin/eventos/editor?id=${e.id}`)}
        onDelete={setDeleteTarget}
        emptyMessage="Nenhum evento cadastrado ainda."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Excluir permanentemente "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
