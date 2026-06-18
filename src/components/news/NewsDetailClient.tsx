"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Carousel } from "@/components/shared/Carousel";
import { getNewsBySlug, getCategories } from "@/lib/data/content";
import type { NewsItem, Category } from "@/lib/types";
import { assetPath, cn } from "@/lib/utils";
import { button, container, containerNarrow, section, typography } from "@/lib/design/tokens";
import { WHATSAPP_MESSAGES, whatsappLink } from "@/lib/whatsapp";

function slugFromPath(): string {
  if (typeof window === "undefined") return "";
  const parts = window.location.pathname.split("/").filter(Boolean);
  return decodeURIComponent(parts[parts.length - 1] ?? "");
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function NewsDetailClient() {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [category, setCategory] = useState<Category | undefined>();
  const [status, setStatus] = useState<"loading" | "ready" | "notfound">("loading");

  useEffect(() => {
    let on = true;
    const slug = slugFromPath();
    if (!slug) {
      setStatus("notfound");
      return;
    }
    (async () => {
      const [n, categories] = await Promise.all([getNewsBySlug(slug), getCategories()]);
      if (!on) return;
      if (!n) {
        setStatus("notfound");
        return;
      }
      setNews(n);
      setCategory(categories.find((c) => c.id === n.category_id));
      setStatus("ready");
    })();
    return () => {
      on = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <main className="bg-white">
        <div className={cn(section, containerNarrow)}>
          <div className="h-10 w-2/3 animate-pulse rounded bg-border/40" />
          <div className="mt-6 h-64 w-full animate-pulse rounded-xl bg-border/30" />
        </div>
      </main>
    );
  }

  if (status === "notfound" || !news) {
    return (
      <main className={cn(section, "flex flex-col items-center text-center")}>
        <div className={containerNarrow}>
          <p className={typography.eyebrow}>404</p>
          <h1 className={cn(typography.h2, "mt-2")}>Notícia não encontrada</h1>
          <Link href="/noticias" className={cn(button.primary, "mt-6")}>
            Ver todas as notícias
          </Link>
        </div>
      </main>
    );
  }

  const gallery = news.gallery ?? [];
  const imageSrc = news.cover_image ? assetPath(news.cover_image) : null;
  const waLink = whatsappLink(WHATSAPP_MESSAGES.post(news.title));

  return (
    <main className="bg-white">
      <div className={cn(section, container)}>
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-azul-lavanda transition-colors">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href="/noticias" className="hover:text-azul-lavanda transition-colors">Notícias</Link>
          <span aria-hidden="true">/</span>
          <span className="text-azul-petroleo/70 line-clamp-1">{news.title}</span>
        </nav>

        <article className={containerNarrow}>
          <header className="mb-8 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {category && (
                <span className="rounded-full bg-azul-claro/15 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-azul-lavanda">
                  {category.name}
                </span>
              )}
              {news.published_at && (
                <time dateTime={news.published_at} className="text-sm text-muted">
                  {formatDate(news.published_at)}
                </time>
              )}
              {news.location && <span className="text-sm text-muted">— {news.location}</span>}
            </div>
            <h1 className={typography.h1}>{news.title}</h1>
          </header>

          {imageSrc && (
            <Image
              src={imageSrc}
              alt={news.cover_alt ?? news.title}
              width={768}
              height={432}
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="mb-10 w-full h-auto rounded-xl"
            />
          )}

          <div className="prose-sema mb-10" dangerouslySetInnerHTML={{ __html: news.content }} />

          {gallery.length > 0 && (
            <section aria-label="Fotos da notícia" className="mb-12">
              <h2 className={cn(typography.h3, "mb-4")}>Fotos</h2>
              <Carousel images={gallery} alt={`Fotos — ${news.title}`} />
            </section>
          )}
        </article>
      </div>

      <section className="bg-branco-gelo py-14">
        <div className={cn(containerNarrow, "flex flex-col items-center gap-5 text-center")}>
          <p className={typography.eyebrow}>Precisa de assessoria jurídica?</p>
          <h2 className="text-2xl font-bold text-azul-petroleo sm:text-3xl">Fale com nossa equipe</h2>
          <p className="max-w-lg text-azul-petroleo/70">
            Nossos advogados estão disponíveis para esclarecer dúvidas e apresentar
            as melhores estratégias para o seu caso.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={waLink}
              data-wa-location="noticias_post"
              target="_blank"
              rel="noopener noreferrer"
              className={button.whatsapp}
            >
              Falar pelo WhatsApp
            </a>
            <Link href="/contato" className={button.secondary}>
              Formulário de contato
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
