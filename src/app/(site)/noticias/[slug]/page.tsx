import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { NewsDetailClient } from "@/components/news/NewsDetailClient";

// SPA: shell estático único; o slug real vem da URL em runtime (client busca na API).
// Slugs reais caem aqui via rewrite no .htaccess — sem rebuild ao publicar.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: "_" }];
}

export const metadata: Metadata = {
  title: "Notícias",
  description: `Atualizações jurídicas e institucionais da ${SITE.name}.`,
};

export default function NoticiaPage() {
  return <NewsDetailClient />;
}
