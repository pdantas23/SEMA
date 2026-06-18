"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Carousel } from "@/components/shared/Carousel";
import { InstagramEmbed } from "@/components/shared/InstagramEmbed";
import { getEventBySlug } from "@/lib/data/content";
import type { EventItem } from "@/lib/types";
import { assetPath, cn } from "@/lib/utils";
import { button, container, containerNarrow, section, typography } from "@/lib/design/tokens";
import { WHATSAPP_MESSAGES, whatsappLink } from "@/lib/whatsapp";

function slugFromPath(): string {
  if (typeof window === "undefined") return "";
  const parts = window.location.pathname.split("/").filter(Boolean);
  return decodeURIComponent(parts[parts.length - 1] ?? "");
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function EventDetailClient() {
  const [event, setEvent] = useState<EventItem | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "notfound">("loading");

  useEffect(() => {
    let on = true;
    const slug = slugFromPath();
    if (!slug) {
      setStatus("notfound");
      return;
    }
    (async () => {
      const e = await getEventBySlug(slug);
      if (!on) return;
      if (!e) {
        setStatus("notfound");
        return;
      }
      setEvent(e);
      setStatus("ready");
    })();
    return () => {
      on = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <main className="bg-white">
        <div className={cn(section, containerNarrow)}>
          <div className="h-10 w-2/3 animate-pulse rounded bg-border/40" />
          <div className="mt-6 h-64 w-full animate-pulse rounded-xl bg-border/30" />
        </div>
      </main>
    );
  }

  if (status === "notfound" || !event) {
    return (
      <main className={cn(section, "flex flex-col items-center text-center")}>
        <div className={containerNarrow}>
          <p className={typography.eyebrow}>404</p>
          <h1 className={cn(typography.h2, "mt-2")}>Evento não encontrado</h1>
          <Link href="/eventos" className={cn(button.primary, "mt-6")}>
            Ver todos os eventos
          </Link>
        </div>
      </main>
    );
  }

  const gallery = event.gallery ?? [];
  const imageSrc = event.cover_image ? assetPath(event.cover_image) : null;
  const waLink = whatsappLink(WHATSAPP_MESSAGES.default);

  return (
    <main className="bg-white">
      <div className={cn(section, container)}>
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-azul-lavanda transition-colors">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href="/eventos" className="hover:text-azul-lavanda transition-colors">Eventos</Link>
          <span aria-hidden="true">/</span>
          <span className="text-azul-petroleo/70 line-clamp-1">{event.name}</span>
        </nav>

        <article className={containerNarrow}>
          <header className="mb-8 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {event.theme && (
                <span className="rounded-full bg-azul-lavanda/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-azul-lavanda">
                  {event.theme}
                </span>
              )}
              {event.event_date && (
                <time dateTime={event.event_date} className="text-sm font-semibold text-azul-claro">
                  {formatDate(event.event_date)}
                </time>
              )}
              {event.location && <span className="text-sm text-muted">{event.location}</span>}
            </div>
            <h1 className={typography.h1}>{event.name}</h1>
          </header>

          {imageSrc && (
            <Image
              src={imageSrc}
              alt={event.cover_alt ?? event.name}
              width={768}
              height={432}
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="mb-10 w-full h-auto rounded-xl"
            />
          )}

          <div className="prose-sema mb-10" dangerouslySetInnerHTML={{ __html: event.description }} />

          {gallery.length > 0 && (
            <section aria-label="Fotos do evento" className="mb-12">
              <h2 className={cn(typography.h3, "mb-4")}>Fotos</h2>
              <Carousel images={gallery} alt={`Fotos — ${event.name}`} />
            </section>
          )}

          {event.instagram_url && (
            <section aria-label="Publicação no Instagram" className="mb-10">
              <h2 className={cn(typography.h3, "mb-4")}>Publicação no Instagram</h2>
              <InstagramEmbed url={event.instagram_url} />
            </section>
          )}

          {event.related_link && (
            <div className="mb-10">
              <a
                href={event.related_link}
                target="_blank"
                rel="noopener noreferrer"
                className={button.secondary}
              >
                Saiba mais sobre este evento →
              </a>
            </div>
          )}
        </article>
      </div>

      <section className="bg-branco-gelo py-14">
        <div className={cn(containerNarrow, "flex flex-col items-center gap-5 text-center")}>
          <p className={typography.eyebrow}>Interessado em participar de eventos jurídicos conosco?</p>
          <h2 className="text-2xl font-bold text-azul-petroleo sm:text-3xl">Fale com nossa equipe</h2>
          <p className="max-w-lg text-azul-petroleo/70">
            Entre em contato com nossa equipe para mais informações sobre eventos
            e participações do escritório.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={waLink}
              data-wa-location="eventos_post"
              target="_blank"
              rel="noopener noreferrer"
              className={button.whatsapp}
            >
              Falar pelo WhatsApp
            </a>
            <Link href="/contato" className={button.secondary}>
              Formulário de contato
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
