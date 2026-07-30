import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { assetPath } from "@/lib/utils";

/**
 * Metadata de compartilhamento (Open Graph / Twitter Card).
 *
 * Por que existe: o robô do WhatsApp/Facebook não executa JavaScript — ele lê
 * apenas o HTML entregue pelo servidor. Logo, título/descrição/imagem do card
 * precisam estar no <head> gerado no BUILD, não no client.
 *
 * Regra de imagem (pedido do cliente):
 *   - conteúdo COM cover_image  → a foto da própria matéria;
 *   - conteúdo SEM cover_image  → a imagem institucional da marca (OG_DEFAULT).
 */

/** Imagem institucional 1200x630 (identidade visual — Manual de ID). */
export const OG_DEFAULT = {
  url: assetPath("/og-image.png"),
  width: 1200,
  height: 630,
  alt: `${SITE.name} — ${SITE.tagline}`,
};

/**
 * URL canônica absoluta. O site roda com `trailingSlash: true`, então a barra
 * final faz parte da URL real — canonical sem ela apontaria para outro endereço.
 */
export function canonicalUrl(path = "/"): string {
  const normalized = `/${path.replace(/^\/|\/$/g, "")}`;
  return `${SITE.url}${normalized === "/" ? "/" : `${normalized}/`}`;
}

/**
 * og:image PRECISA ser URL absoluta — crawler não resolve caminho relativo.
 * Hoje o admin sempre grava a URL pública completa do Supabase, mas uma capa
 * colada à mão poderia vir como "/algo.jpg" e quebrar o card silenciosamente.
 */
export function absoluteImageUrl(src: string): string {
  const url = src.trim();
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return `${SITE.url}/${url.replace(/^\//, "")}`;
}

/** Limites recomendados pelas plataformas antes de truncar o card. */
const TITLE_MAX = 70;
const DESC_MAX = 200;

/** Converte HTML/markdown do corpo em texto corrido, para servir de descrição. */
export function toPlainText(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ") // tags HTML
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // imagens markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links markdown → só o texto
    .replace(/[#>*_`~]/g, " ") // marcadores markdown
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/** Corta no limite sem quebrar palavra ao meio. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

interface ShareInput {
  /** Título do conteúdo (title / name). */
  title: string;
  /** Caminho da página, ex.: "/blog/meu-post". */
  path: string;
  /** Melhor resumo disponível: excerpt, description… */
  summary?: string | null;
  /** Corpo do conteúdo, usado como descrição quando não há resumo. */
  body?: string | null;
  /** Capa do conteúdo (URL pública do Supabase). Sem ela, cai na marca. */
  image?: string | null;
  imageAlt?: string | null;
  /** Sobrescritas vindas do admin (aba SEO). */
  seoTitle?: string | null;
  seoDescription?: string | null;
  /** ISO date — vira article:published_time. */
  publishedAt?: string | null;
  author?: string | null;
}

/**
 * Monta o Metadata de uma página de detalhe (post, notícia ou evento).
 * Prioridade: campos de SEO do admin → campos do conteúdo → padrão do site.
 */
export function buildShareMetadata(input: ShareInput): Metadata {
  const title = truncate(input.seoTitle?.trim() || input.title, TITLE_MAX);

  // O layout raiz aplica o template "%s | SENMA". Vários seo_title cadastrados no
  // admin já terminam com a marca ("… | SEMA Advogados"), o que gerava
  // "… | SEMA Advogados | SENMA" na aba do navegador. Se a marca já está no
  // título, publica ele como está.
  const brandAlreadyInTitle = /\bsen?ma\b/i.test(title);

  const description = truncate(
    input.seoDescription?.trim() ||
      toPlainText(input.summary) ||
      toPlainText(input.body) ||
      SITE.description,
    DESC_MAX
  );

  const hasCover = Boolean(input.image?.trim());
  const image = hasCover
    ? {
        url: absoluteImageUrl(input.image!),
        alt: input.imageAlt?.trim() || input.title,
      }
    : OG_DEFAULT;

  const url = canonicalUrl(input.path);

  return {
    title: brandAlreadyInTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      siteName: SITE.name,
      url,
      title,
      description,
      images: [image],
      publishedTime: input.publishedAt ?? undefined,
      authors: input.author ? [input.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

/**
 * Fallback usado quando o slug não existe na API no momento do build
 * (inclusive o shell "_" do .htaccess, que atende conteúdo publicado
 * depois do último deploy). Card institucional, sem quebrar nada.
 */
export function fallbackShareMetadata(section: string, description: string): Metadata {
  return {
    title: section,
    description,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: SITE.name,
      title: `${section} | ${SITE.shortName}`,
      description,
      images: [OG_DEFAULT],
    },
    twitter: {
      card: "summary_large_image",
      title: `${section} | ${SITE.shortName}`,
      description,
      images: [OG_DEFAULT.url],
    },
  };
}
