import Link from "next/link";
import type { Post } from "@/lib/types";
import { container, section, typography } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { PostCard } from "@/components/blog/PostCard";

interface FeaturedPostsSectionProps {
  posts: Post[];
}

export function FeaturedPostsSection({ posts }: FeaturedPostsSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className={cn(section, "bg-white")} aria-labelledby="posts-heading">
      <div className={container}>
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className={cn(typography.eyebrow, "mb-2")}>Conteúdo</p>
            <h2 id="posts-heading" className={typography.h2}>
              Artigos em Destaque
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-azul-lavanda hover:text-azul-petroleo transition-colors shrink-0"
          >
            Ver todos os artigos
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
