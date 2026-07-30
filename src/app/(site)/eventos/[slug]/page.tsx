import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { getAllEventSlugs, getEventBySlugAtBuild } from "@/lib/data/content";
import { buildShareMetadata, fallbackShareMetadata } from "@/lib/seo";
import { SHELL_SLUG, staticParamsWithShell } from "@/lib/static-params";
import { EventDetailClient } from "@/components/events/EventDetailClient";

// Ver comentário em blog/[slug]/page.tsx: cada evento publicado vira pasta real
// no export (com <head> próprio para o card de compartilhamento); os publicados
// depois do build caem no shell "_" via rewrite do .htaccess.
export const dynamicParams = false;

export async function generateStaticParams() {
  return staticParamsWithShell(await getAllEventSlugs(), "eventos");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = slug === SHELL_SLUG ? null : await getEventBySlugAtBuild(slug);

  if (!item) {
    return fallbackShareMetadata(
      "Eventos",
      `Eventos e presença institucional da ${SITE.name}.`
    );
  }

  return buildShareMetadata({
    title: item.name,
    path: `/eventos/${item.slug}`,
    summary: item.theme,
    body: item.description,
    image: item.cover_image ?? item.gallery?.[0],
    imageAlt: item.cover_alt,
    seoTitle: item.seo_title,
    seoDescription: item.seo_description,
    publishedAt: item.event_date,
  });
}

export default function EventoPage() {
  return <EventDetailClient />;
}
