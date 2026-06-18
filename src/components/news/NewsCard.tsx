import Image from "next/image";
import { cn, assetPath } from "@/lib/utils";
import { card, typography, button } from "@/lib/design/tokens";
import type { NewsItem } from "@/lib/types";

interface NewsCardProps {
  news: NewsItem;
  className?: string;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function NewsCard({ news, className }: NewsCardProps) {
  const href = `/noticias/${news.slug}`;
  const imageSrc = news.cover_image ? assetPath(news.cover_image) : null;

  return (
    <article className={cn(card, "flex flex-col overflow-hidden p-0", className)}>
      <a href={href} className="group block overflow-hidden" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-[16/9] bg-azul-petroleo/10">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={news.cover_alt ?? news.title}
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
          {news.published_at && (
            <time
              dateTime={news.published_at}
              className={typography.muted}
            >
              {formatDate(news.published_at)}
            </time>
          )}
          {news.location && (
            <span className="ml-auto text-xs text-muted">
              {news.location}
            </span>
          )}
        </div>

        <a href={href} className="group">
          <h2 className="line-clamp-2 text-lg font-bold leading-snug text-azul-petroleo transition-colors group-hover:text-azul-lavanda">
            {news.title}
          </h2>
        </a>

        {news.seo_description && (
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-azul-petroleo/70">
            {news.seo_description}
          </p>
        )}

        <a href={href} className={cn(button.ghost, "mt-auto self-start px-0")}>
          Ler mais →
        </a>
      </div>
    </article>
  );
}

export default NewsCard;
