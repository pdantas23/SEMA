import type { Metadata } from "next";
import { Suspense } from "react";
import { container, section, typography } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { OG_DEFAULT, canonicalUrl } from "@/lib/seo";
import { BlogListClient } from "@/components/blog/BlogListClient";

export const metadata: Metadata = {
  title: "Blog",
  description: `Artigos técnicos, análises e atualizações jurídicas da ${SITE.name}.`,
  alternates: { canonical: canonicalUrl("/blog") },
  openGraph: {
    url: canonicalUrl("/blog"),
    title: `Blog | ${SITE.shortName}`,
    description: `Conteúdo especializado em Direito Tributário, Empresarial e Ambiental — ${SITE.name}.`,
    type: "website",
    images: [OG_DEFAULT],
  },
};

// Shell estático (output: export). Conteúdo e filtros são resolvidos no cliente
// em runtime (BlogListClient busca na API; filtros vêm da URL via useSearchParams).
export default function BlogPage() {
  return (
    <main className={cn(section, "bg-background")}>
      <div className={container}>
        <header className="mb-10 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-azul-claro">
            Conteúdo especializado
          </p>
          <h1 className={typography.h1}>Blog Jurídico</h1>
          <p className={cn(typography.lead, "max-w-2xl")}>
            Análises técnicas, atualizações legislativas e perspectivas estratégicas
            nas áreas de atuação do escritório.
          </p>
        </header>

        <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-border/30" />}>
          <BlogListClient />
        </Suspense>
      </div>
    </main>
  );
}
