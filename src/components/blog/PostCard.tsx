import Image from "next/image";
import { cn } from "@/lib/utils";
import { assetPath } from "@/lib/utils";
import { card, typography, button } from "@/lib/design/tokens";
import type { Post, Category } from "@/lib/types";

interface PostCardProps {
  post: Post;
  category?: Category;
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

export function PostCard({ post, category, className }: PostCardProps) {
  const href = `/blog/${post.slug}`;
  const imageSrc = post.cover_image ? assetPath(post.cover_image) : null;

  return (
    <article className={cn(card, "flex flex-col overflow-hidden p-0", className)}>
      <a href={href} className="group block overflow-hidden" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-[16/9] bg-azul-petroleo/10">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={post.cover_alt ?? post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl font-extrabold text-azul-lavanda/30 select-none">
                SEMA
              </span>
            </div>
          )}
        </div>
      </a>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-3">
          {category && (
            <span className="rounded-full bg-azul-claro/15 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-azul-lavanda">
              {category.name}
            </span>
          )}
          {post.published_at && (
            <time
              dateTime={post.published_at}
              className={cn(typography.muted, "ml-auto shrink-0")}
            >
              {formatDate(post.published_at)}
            </time>
          )}
        </div>

        <a href={href} className="group">
          <h2 className="line-clamp-2 text-lg font-bold leading-snug text-azul-petroleo transition-colors group-hover:text-azul-lavanda">
            {post.title}
          </h2>
        </a>

        {post.excerpt && (
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-azul-petroleo/70">
            {post.excerpt}
          </p>
        )}

        <a href={href} className={cn(button.ghost, "mt-auto self-start px-0")}>
          Ler mais →
        </a>
      </div>
    </article>
  );
}

export default PostCard;
