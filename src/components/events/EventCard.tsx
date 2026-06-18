import Image from "next/image";
import { cn, assetPath } from "@/lib/utils";
import { card, typography, button } from "@/lib/design/tokens";
import type { EventItem } from "@/lib/types";

interface EventCardProps {
  event: EventItem;
  className?: string;
}

function formatEventDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Converte a descrição (HTML/markdown) em texto puro para o resumo do card. */
function plainExcerpt(content: string): string {
  return content
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*?|__|`/g, "")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function EventCard({ event, className }: EventCardProps) {
  const href = `/eventos/${event.slug}`;
  const imageSrc = event.cover_image ? assetPath(event.cover_image) : null;

  return (
    <article className={cn(card, "flex flex-col overflow-hidden p-0", className)}>
      <a href={href} className="group block overflow-hidden" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-[16/9] bg-azul-petroleo/10">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={event.cover_alt ?? event.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="select-none text-4xl font-extrabold text-azul-lavanda/30">
                SEMA
              </span>
            </div>
          )}
        </div>
      </a>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          {event.event_date && (
            <time dateTime={event.event_date} className={typography.muted}>
              {formatEventDate(event.event_date)}
            </time>
          )}
          {event.location && (
            <span className="ml-auto text-xs text-muted">
              {event.location}
            </span>
          )}
        </div>

        <a href={href} className="group">
          <h2 className="line-clamp-2 text-lg font-bold leading-snug text-azul-petroleo transition-colors group-hover:text-azul-lavanda">
            {event.name}
          </h2>
        </a>

        {event.description && (
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-azul-petroleo/70">
            {plainExcerpt(event.description)}
          </p>
        )}

        <a href={href} className={cn(button.ghost, "mt-auto self-start px-0")}>
          Ver detalhes →
        </a>
      </div>
    </article>
  );
}

export default EventCard;
