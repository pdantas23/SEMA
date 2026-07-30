import type { Metadata } from "next";
import { container, section, typography } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { OG_DEFAULT, canonicalUrl } from "@/lib/seo";
import { EventsListClient } from "@/components/events/EventsListClient";

export const metadata: Metadata = {
  title: "Eventos",
  description: `Confira os eventos, participações e presença institucional da ${SITE.name}.`,
  alternates: { canonical: canonicalUrl("/eventos") },
  openGraph: {
    url: canonicalUrl("/eventos"),
    title: `Eventos | ${SITE.shortName}`,
    description: `Seminários, congressos e iniciativas institucionais — ${SITE.name}.`,
    type: "website",
    images: [OG_DEFAULT],
  },
};

export default function EventosPage() {
  return (
    <main className={cn(section, "bg-background")}>
      <div className={container}>
        <header className="mb-10 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-azul-claro">
            Presença institucional
          </p>
          <h1 className={typography.h1}>Eventos</h1>
          <p className={cn(typography.lead, "max-w-2xl")}>
            O escritório SENMA Advogados participa ativamente de eventos jurídicos,
            congressos e iniciativas que refletem nosso compromisso com a excelência
            técnica e o desenvolvimento do direito.
          </p>
        </header>

        <EventsListClient />
      </div>
    </main>
  );
}
