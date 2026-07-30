import type { MetadataRoute } from "next";
import { canonicalUrl } from "@/lib/seo";
import {
  getAllPostSlugs,
  getAllNewsSlugs,
  getAllEventSlugs,
} from "@/lib/data/content";

export const dynamic = "force-static";

// Sitemap estático (gerado no build). Inclui rotas fixas + conteúdo publicado.
// O slug-sentinela "sem-conteudo" (empty-guard) é ignorado.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // canonicalUrl aplica a barra final (trailingSlash: true) — o sitemap precisa
  // apontar para a MESMA URL declarada no <link rel="canonical"> de cada página.
  const staticRoutes = [
    "",
    "/blog",
    "/noticias",
    "/eventos",
    "/contato",
    "/politica-de-privacidade",
  ].map((path) => ({
    url: canonicalUrl(path || "/"),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const [posts, news, events] = await Promise.all([
    getAllPostSlugs(),
    getAllNewsSlugs(),
    getAllEventSlugs(),
  ]);

  const clean = (slug: string) => slug && slug !== "sem-conteudo";

  const dynamicRoutes = [
    ...posts.filter(clean).map((s) => `/blog/${s}`),
    ...news.filter(clean).map((s) => `/noticias/${s}`),
    ...events.filter(clean).map((s) => `/eventos/${s}`),
  ].map((path) => ({
    url: canonicalUrl(path),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
