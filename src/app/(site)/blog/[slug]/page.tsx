import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { getAllPostSlugs, getPostBySlugAtBuild } from "@/lib/data/content";
import { buildShareMetadata, fallbackShareMetadata } from "@/lib/seo";
import { SHELL_SLUG, staticParamsWithShell } from "@/lib/static-params";
import { PostDetailClient } from "@/components/blog/PostDetailClient";

// Cada post publicado vira uma pasta real no export, com <head> próprio — é isso
// que o robô do WhatsApp/Facebook lê ao compartilhar o link (ele não roda JS).
// Posts criados DEPOIS do último build caem no shell "_" via rewrite do
// .htaccess: a página abre normalmente (o client busca na API), só o card fica
// institucional até o próximo deploy.
export const dynamicParams = false;

export async function generateStaticParams() {
  return staticParamsWithShell(await getAllPostSlugs(), "blog");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = slug === SHELL_SLUG ? null : await getPostBySlugAtBuild(slug);

  if (!post) {
    return fallbackShareMetadata(
      "Blog",
      `Artigos técnicos e análises jurídicas da ${SITE.name}.`
    );
  }

  return buildShareMetadata({
    title: post.title,
    path: `/blog/${post.slug}`,
    summary: post.excerpt ?? post.subtitle,
    body: post.content,
    image: post.cover_image,
    imageAlt: post.cover_alt,
    seoTitle: post.seo_title,
    seoDescription: post.seo_description,
    publishedAt: post.published_at,
    author: post.author,
  });
}

export default function PostPage() {
  return <PostDetailClient />;
}
