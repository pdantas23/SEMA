import Link from "next/link";
import type { NewsItem, EventItem } from "@/lib/types";
import { container, section, typography } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { NewsCard } from "@/components/news/NewsCard";
import { EventCard } from "@/components/events/EventCard";

interface NewsEventsSectionProps {
  news: NewsItem[];
  events: EventItem[];
}

export function NewsEventsSection({ news, events }: NewsEventsSectionProps) {
  if (news.length === 0 && events.length === 0) return null;

  return (
    <section className={cn(section, "bg-branco-gelo")} aria-labelledby="news-events-heading">
      <div className={container}>
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className={cn(typography.eyebrow, "mb-2")}>Acompanhe</p>
            <h2 id="news-events-heading" className={typography.h2}>
              Notícias e Eventos
            </h2>
          </div>
          <div className="flex gap-4">
            <Link href="/noticias" className="text-sm font-semibold text-azul-lavanda hover:text-azul-petroleo transition-colors">
              Todas as notícias
            </Link>
            <Link href="/eventos" className="text-sm font-semibold text-azul-lavanda hover:text-azul-petroleo transition-colors">
              Todos os eventos
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
          {events.map((item) => (
            <EventCard key={item.id} event={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
