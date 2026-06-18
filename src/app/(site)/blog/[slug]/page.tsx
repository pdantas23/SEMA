import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { PostDetailClient } from "@/components/blog/PostDetailClient";

// SPA: um único shell estático. O slug real é lido da URL em runtime pelo
// client, que busca o post na API. Slugs reais caem aqui via rewrite no .htaccess
// (nenhum rebuild é necessário ao publicar um post novo).
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: "_" }];
}

export const metadata: Metadata = {
  title: "Blog",
  description: `Artigos técnicos e análises jurídicas da ${SITE.name}.`,
};

export default function PostPage() {
  return <PostDetailClient />;
}
