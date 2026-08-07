import { apiGet, apiPost, BUILD_READ } from "@/lib/api/client";
import type {
  Post,
  NewsItem,
  EventItem,
  Area,
  TeamMember,
  Category,
  InstagramPost,
  ContactMessage,
} from "@/lib/types";

/**
 * Camada de acesso a dados (leitura pública + contato).
 * Agora consome a API (api.senma.adv.br) em vez do Supabase direto.
 * Contrato (assinaturas) preservado para todas as páginas/components.
 *
 * Tolerante a falha: se a API estiver indisponível, retorna defaults seguros
 * (o build estático/SSG e o runtime não quebram).
 */

const qs = (params: Record<string, string | number | undefined>) => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
};

/* ----------------------------- Categorias ----------------------------- */
export function getCategories(): Promise<Category[]> {
  return apiGet<Category[]>("/content/categories", []);
}

/* ------------------------------- Blog ------------------------------- */
export function getPosts(
  opts: { category?: string; search?: string; limit?: number; offset?: number } = {}
): Promise<Post[]> {
  return apiGet<Post[]>(`/content/posts${qs(opts)}`, []);
}

export function getFeaturedPosts(limit = 3): Promise<Post[]> {
  return apiGet<Post[]>(`/content/posts/featured${qs({ limit })}`, []);
}

export function getPostBySlug(slug: string): Promise<Post | null> {
  return apiGet<Post | null>(`/content/posts/slug/${encodeURIComponent(slug)}`, null);
}

export function getAllPostSlugs(): Promise<string[]> {
  return apiGet<string[]>("/content/posts/slugs", []);
}

export function getRelatedPosts(
  categoryId: string | null,
  excludeSlug: string,
  limit = 3
): Promise<Post[]> {
  return apiGet<Post[]>(
    `/content/posts/related${qs({ categoryId: categoryId ?? undefined, exclude: excludeSlug, limit })}`,
    []
  );
}

/* ------------------------------ Notícias ------------------------------ */
export function getNews(limit?: number): Promise<NewsItem[]> {
  return apiGet<NewsItem[]>(`/content/news${qs({ limit })}`, []);
}

export function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  return apiGet<NewsItem | null>(`/content/news/slug/${encodeURIComponent(slug)}`, null);
}

export function getAllNewsSlugs(): Promise<string[]> {
  return apiGet<string[]>("/content/news/slugs", []);
}

/* ------------------------------- Eventos ------------------------------- */
export function getEvents(limit?: number): Promise<EventItem[]> {
  return apiGet<EventItem[]>(`/content/events${qs({ limit })}`, []);
}

export function getEventBySlug(slug: string): Promise<EventItem | null> {
  return apiGet<EventItem | null>(`/content/events/slug/${encodeURIComponent(slug)}`, null);
}

export function getAllEventSlugs(): Promise<string[]> {
  return apiGet<string[]>("/content/events/slugs", []);
}

/* ------------------------- Leitura no build (SEO) -------------------------
 * Usadas só em generateMetadata, para montar os cards de compartilhamento.
 * Idênticas às de cima, mas com fetch cacheável (BUILD_READ) — obrigatório
 * em rota estática, senão o Next aborta a geração e o dado chega nulo.
 * ------------------------------------------------------------------------ */
export function getPostBySlugAtBuild(slug: string): Promise<Post | null> {
  return apiGet<Post | null>(
    `/content/posts/slug/${encodeURIComponent(slug)}`,
    null,
    BUILD_READ
  );
}

export function getNewsBySlugAtBuild(slug: string): Promise<NewsItem | null> {
  return apiGet<NewsItem | null>(
    `/content/news/slug/${encodeURIComponent(slug)}`,
    null,
    BUILD_READ
  );
}

export function getEventBySlugAtBuild(slug: string): Promise<EventItem | null> {
  return apiGet<EventItem | null>(
    `/content/events/slug/${encodeURIComponent(slug)}`,
    null,
    BUILD_READ
  );
}

/* ---------------------------- Áreas / Equipe ---------------------------- */
export function getAreas(): Promise<Area[]> {
  return apiGet<Area[]>("/content/areas", []);
}

export function getAreaBySlug(slug: string): Promise<Area | null> {
  return apiGet<Area | null>(`/content/areas/slug/${encodeURIComponent(slug)}`, null);
}

export function getTeam(): Promise<TeamMember[]> {
  return apiGet<TeamMember[]>("/content/team", []);
}

/* ------------------------------ Instagram ------------------------------ */
export function getInstagramPosts(limit?: number): Promise<InstagramPost[]> {
  return apiGet<InstagramPost[]>(`/content/instagram${qs({ limit })}`, []);
}

/* ------------------------------- Contato ------------------------------- */
/** Envia o formulário de contato para a API (grava em leads_sema). */
export async function submitContact(
  msg: ContactMessage
): Promise<{ ok: boolean; error?: string }> {
  try {
    return await apiPost<{ ok: boolean; error?: string }>("/contact", msg);
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
