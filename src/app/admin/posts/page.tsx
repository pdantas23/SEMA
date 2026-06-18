"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { postsRepo } from "@/lib/admin/repository";
import type { Post } from "@/lib/types";
import { AdminTable, type Column } from "@/components/admin/AdminTable";
import { AdminToggle } from "@/components/admin/AdminField";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { button } from "@/lib/design/tokens";

export default function PostsListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPosts(await postsRepo.list());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Atualização otimista: alterna o estado local na hora e persiste em segundo
  // plano (sem recarregar a lista inteira, que causava o "piscar" da tela).
  async function handleTogglePublished(post: Post) {
    const next = !post.published;
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, published: next } : p))
    );
    try {
      await postsRepo.togglePublished(post.id, next);
    } catch {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, published: post.published } : p))
      );
    }
  }

  async function handleToggleFeatured(post: Post) {
    const next = !post.featured;
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, featured: next } : p))
    );
    try {
      await postsRepo.toggleFeatured(post.id, next);
    } catch {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, featured: post.featured } : p))
      );
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await postsRepo.remove(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Post>[] = [
    {
      key: "title",
      label: "Título",
      render: (p) => (
        <div>
          <div className="font-medium text-azul-petroleo line-clamp-1">{p.title}</div>
          <div className="text-xs text-muted">{p.slug}</div>
        </div>
      ),
    },
    {
      key: "author",
      label: "Autor",
      render: (p) => <span className="text-muted">{p.author ?? "—"}</span>,
    },
    {
      key: "published",
      label: "Publicado",
      render: (p) => (
        <AdminToggle
          label=""
          checked={p.published}
          onChange={() => handleTogglePublished(p)}
        />
      ),
    },
    {
      key: "featured",
      label: "Destaque",
      render: (p) => (
        <AdminToggle
          label=""
          checked={p.featured}
          onChange={() => handleToggleFeatured(p)}
        />
      ),
    },
    {
      key: "created_at",
      label: "Criado em",
      render: (p) => (
        <span className="text-xs text-muted">
          {new Date(p.created_at).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-azul-petroleo">Posts do Blog</h1>
          <p className="text-sm text-muted">{posts.length} registros</p>
        </div>
        <button
          className={button.primary}
          onClick={() => router.push("/admin/posts/editor")}
        >
          <Plus className="h-4 w-4" />
          Novo Post
        </button>
      </div>

      <AdminTable
        columns={columns}
        rows={posts}
        loading={loading}
        onEdit={(p) => router.push(`/admin/posts/editor?id=${p.id}`)}
        onDelete={setDeleteTarget}
        emptyMessage="Nenhum post cadastrado ainda."
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
