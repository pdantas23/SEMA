import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { getAllNewsSlugs, getNewsBySlugAtBuild } from "@/lib/data/content";
import { buildShareMetadata, fallbackShareMetadata } from "@/lib/seo";
import { SHELL_SLUG, staticParamsWithShell } from "@/lib/static-params";
import { NewsDetailClient } from "@/components/news/NewsDetailClient";

// Ver comentário em blog/[slug]/page.tsx: cada notícia publicada vira pasta real
// no export (com <head> próprio para o card de compartilhamento); as publicadas
// depois do build caem no shell "_" via rewrite do .htaccess.
export const dynamicParams = false;

export async function generateStaticParams() {
  return staticParamsWithShell(await getAllNewsSlugs(), "notícias");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = slug === SHELL_SLUG ? null : await getNewsBySlugAtBuild(slug);

  if (!item) {
    return fallbackShareMetadata(
      "Notícias",
      `Atualizações jurídicas e institucionais da ${SITE.name}.`
    );
  }

  return buildShareMetadata({
    title: item.title,
    path: `/noticias/${item.slug}`,
    // Notícia não tem excerpt: a descrição sai do próprio corpo.
    body: item.content,
    image: item.cover_image ?? item.gallery?.[0],
    imageAlt: item.cover_alt,
    seoTitle: item.seo_title,
    seoDescription: item.seo_description,
    publishedAt: item.published_at,
  });
}

export default function NoticiaPage() {
  return <NewsDetailClient />;
}
