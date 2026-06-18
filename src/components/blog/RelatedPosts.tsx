import Image from "next/image";
import { assetPath, cn } from "@/lib/utils";
import { typography } from "@/lib/design/tokens";
import type { Post } from "@/lib/types";

interface RelatedPostsProps {
  posts: Post[];
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <aside aria-label="Posts relacionados">
      <h2 className={cn(typography.h2, "mb-6")}>Conteúdo relacionado</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const imageSrc = post.cover_image ? assetPath(post.cover_image) : null;
          return (
            <li key={post.id}>
              <a
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-azul-petroleo/10">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={post.cover_alt ?? post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-2xl font-extrabold text-azul-lavanda/30 select-none">
                        SEMA
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-azul-petroleo transition-colors group-hover:text-azul-lavanda">
                    {post.title}
                  </p>
                  {post.published_at && (
                    <time dateTime={post.published_at} className="text-xs text-muted">
                      {formatDate(post.published_at)}
                    </time>
                  )}
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default RelatedPosts;
