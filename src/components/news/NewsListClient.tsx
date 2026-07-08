"use client";

import { useEffect, useState } from "react";
import { getNews } from "@/lib/data/content";
import type { NewsItem } from "@/lib/types";
import { NewsCard } from "@/components/news/NewsCard";
import { typography } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

/** Lista de notícias buscada em runtime na API (publica na hora, sem rebuild). */
export function NewsListClient() {
  const [news, setNews] = useState<NewsItem[] | null>(null);

  useEffect(() => {
    let on = true;
    getNews().then((r) => on && setNews(r));
    return () => {
      on = false;
    };
  }, []);

  if (news === null) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl bg-border/30" />
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface py-20 text-center">
        <span className="text-5xl font-extrabold text-azul-lavanda/20 select-none">SENMA</span>
        <p className={cn(typography.body, "mt-4")}>Nenhuma notícia publicada no momento.</p>
        <p className="mt-1 text-sm text-muted">Volte em breve para novas atualizações.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}
