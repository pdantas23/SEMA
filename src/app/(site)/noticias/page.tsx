import type { Metadata } from "next";
import { container, section, typography } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { NewsListClient } from "@/components/news/NewsListClient";

export const metadata: Metadata = {
  title: "Notícias",
  description: `Fique atualizado com as últimas notícias jurídicas e institucionais da ${SITE.name}.`,
  openGraph: {
    title: `Notícias | ${SITE.shortName}`,
    description: `Atualizações jurídicas, legislativas e institucionais — ${SITE.name}.`,
    type: "website",
  },
};

export default function NoticiasPage() {
  return (
    <main className={cn(section, "bg-background")}>
      <div className={container}>
        <header className="mb-10 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-azul-claro">
            Atualizações
          </p>
          <h1 className={typography.h1}>Notícias</h1>
          <p className={cn(typography.lead, "max-w-2xl")}>
            Acompanhe as últimas atualizações legislativas, jurisprudenciais e
            institucionais relevantes para os nossos clientes e parceiros.
          </p>
        </header>

        <NewsListClient />
      </div>
    </main>
  );
}
