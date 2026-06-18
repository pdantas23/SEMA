"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Newspaper,
  CalendarDays,
  Tag,
  Link2,
  Users,
  Plus,
} from "lucide-react";
import { postsRepo } from "@/lib/admin/repository";
import { newsRepo } from "@/lib/admin/repository";
import { eventsRepo } from "@/lib/admin/repository";
import { leadsRepo } from "@/lib/admin/repository";
import { card } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

interface CountCard {
  label: string;
  count: number | null;
  href: string;
  newHref?: string;
  icon: React.ElementType;
  color: string;
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Record<string, number | null>>({
    leads: null,
    posts: null,
    news: null,
    events: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [leads, posts, news, events] = await Promise.allSettled([
          leadsRepo.list(),
          postsRepo.list(),
          newsRepo.list(),
          eventsRepo.list(),
        ]);
        setCounts({
          leads: leads.status === "fulfilled" ? leads.value.length : 0,
          posts: posts.status === "fulfilled" ? posts.value.length : 0,
          news: news.status === "fulfilled" ? news.value.length : 0,
          events: events.status === "fulfilled" ? events.value.length : 0,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards: CountCard[] = [
    {
      label: "Leads (CRM)",
      count: counts.leads,
      href: "/admin/leads",
      icon: Users,
      color: "text-azul-petroleo",
    },
    {
      label: "Posts do Blog",
      count: counts.posts,
      href: "/admin/posts",
      newHref: "/admin/posts/editor",
      icon: FileText,
      color: "text-azul-petroleo",
    },
    {
      label: "Notícias",
      count: counts.news,
      href: "/admin/noticias",
      newHref: "/admin/noticias/editor",
      icon: Newspaper,
      color: "text-azul-lavanda",
    },
    {
      label: "Eventos",
      count: counts.events,
      href: "/admin/eventos",
      newHref: "/admin/eventos/editor",
      icon: CalendarDays,
      color: "text-azul-claro",
    },
  ];

  const shortcuts = [
    { label: "Categorias", href: "/admin/categorias", icon: Tag },
    { label: "Instagram", href: "/admin/instagram", icon: Link2 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-azul-petroleo">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Visão geral do conteúdo do site SEMA.
        </p>
      </div>

      {/* Count cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={cn(card, "flex flex-col gap-3")}>
              <div className="flex items-center justify-between">
                <Icon className={cn("h-5 w-5", c.color)} />
                {c.newHref && (
                  <Link
                    href={c.newHref}
                    className="flex items-center gap-1 rounded-md bg-azul-petroleo px-2 py-1 text-xs font-medium text-white hover:bg-azul-lavanda transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Novo
                  </Link>
                )}
              </div>
              <div>
                <div className="text-3xl font-extrabold text-azul-petroleo">
                  {loading ? "…" : (counts[c.label.toLowerCase()] ?? c.count ?? 0)}
                </div>
                <Link
                  href={c.href}
                  className="text-sm text-muted hover:text-azul-lavanda transition-colors"
                >
                  {c.label}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted uppercase tracking-wider">
          Acesso Rápido
        </h2>
        <div className="flex flex-wrap gap-3">
          {shortcuts.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-azul-petroleo hover:border-azul-lavanda hover:text-azul-lavanda transition-colors"
              >
                <Icon className="h-4 w-4" />
                {s.label}
              </Link>
            );
          })}
          {cards
            .filter((c) => c.newHref)
            .map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.newHref}
                  href={c.newHref!}
                  className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted hover:border-azul-lavanda hover:text-azul-lavanda transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  <Icon className="h-4 w-4" />
                  Novo em {c.label}
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
