"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getPostBySlug,
  getCategories,
  getRelatedPosts,
} from "@/lib/data/content";
import type { Post, Category } from "@/lib/types";
import { assetPath, cn } from "@/lib/utils";
import {
  container,
  containerNarrow,
  containerHero,
  section,
  typography,
  button,
} from "@/lib/design/tokens";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import InstagramEmbed from "@/components/shared/InstagramEmbed";

/** Lê o slug do último segmento da URL (SPA — sem depender do router do Next). */
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

function isHtml(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hublp])/gm, "")
    .trim();
}

function renderContent(content: string): string {
  if (isHtml(content)) return content;
  return `<p>${markdownToHtml(content)}</p>`;
}

export function PostDetailClient() {
  const [post, setPost] = useState<Post | null>(null);
  const [category, setCategory] = useState<Category | undefined>();
  const [related, setRelated] = useState<Post[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "notfound">("loading");

  useEffect(() => {
    let on = true;
    const slug = slugFromPath();
    if (!slug) {
      setStatus("notfound");
      return;
    }
    (async () => {
      const [p, categories] = await Promise.all([getPostBySlug(slug), getCategories()]);
      if (!on) return;
      if (!p) {
        setStatus("notfound");
        return;
      }
      setPost(p);
      setCategory(categories.find((c) => c.id === p.category_id));
      setStatus("ready");
      const rel = await getRelatedPosts(p.category_id, p.slug, 3);
      if (on) setRelated(rel);
    })();
    return () => {
      on = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <main className={cn(section)}>
        <div className={containerNarrow}>
          <div className="h-10 w-2/3 animate-pulse rounded bg-border/40" />
          <div className="mt-6 h-64 w-full animate-pulse rounded-xl bg-border/30" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-border/30" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (status === "notfound" || !post) {
    return (
      <main className={cn(section, "flex flex-col items-center text-center")}>
        <div className={containerNarrow}>
          <p className={typography.eyebrow}>404</p>
          <h1 className={cn(typography.h2, "mt-2")}>Artigo não encontrado</h1>
          <p className="mt-3 text-azul-petroleo/70">
            O conteúdo que você procura não existe ou foi removido.
          </p>
          <Link href="/blog" className={cn(button.primary, "mt-6")}>
            Ver todos os artigos
          </Link>
        </div>
      </main>
    );
  }

  const waLink = whatsappLink(WHATSAPP_MESSAGES.post(post.title));
  const imageSrc = post.cover_image ? assetPath(post.cover_image) : null;
  const contentHtml = renderContent(post.content);

  return (
    <main>
      <section className={cn(section, "relative overflow-hidden bg-azul-petroleo text-white")}>
        {imageSrc && (
          <>
            <Image
              src={imageSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-azul-petroleo/40" aria-hidden="true" />
          </>
        )}
        <div className={cn(containerHero, "relative z-10")}>
          <div
            className={cn(
              "flex flex-col items-center gap-5 text-center",
              imageSrc &&
                "rounded-2xl bg-azul-petroleo/60 backdrop-blur-md px-5 py-9 sm:px-10 sm:py-12"
            )}
          >
            {category && (
              <span className="w-fit rounded-full bg-azul-claro/20 px-3 py-1 text-sm font-semibold uppercase tracking-widest text-azul-claro">
                {category.name}
              </span>
            )}
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="text-lg leading-relaxed text-white/75">{post.subtitle}</p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
              {post.author && <span>{post.author}</span>}
              {post.published_at && (
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={cn(section, "bg-white")}>
        <div className={containerNarrow}>
          <div className="prose-sema" dangerouslySetInnerHTML={{ __html: contentHtml }} />

          {post.instagram_url && (
            <div className="mt-8">
              <InstagramEmbed url={post.instagram_url} />
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-azul-claro/10 px-3 py-1 text-xs font-medium text-azul-lavanda"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-branco-gelo py-14">
        <div className={cn(containerNarrow, "flex flex-col items-center gap-5 text-center")}>
          <p className={typography.eyebrow}>Precisa de orientação jurídica?</p>
          <h2 className="text-2xl font-bold text-azul-petroleo sm:text-3xl">
            Fale com nossa equipe
          </h2>
          <p className="max-w-lg text-azul-petroleo/70">
            Nossos advogados estão disponíveis para esclarecer dúvidas e apresentar
            as melhores estratégias para o seu caso.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={waLink}
              data-wa-location="blog_post"
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

      {related.length > 0 && (
        <section className={cn(section, "bg-white")}>
          <div className={container}>
            <RelatedPosts posts={related} />
          </div>
        </section>
      )}

      <section className="bg-azul-lavanda">
        <div className={cn(container, "py-10")}>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            ← Voltar à página inicial
          </Link>
        </div>
      </section>
    </main>
  );
}
