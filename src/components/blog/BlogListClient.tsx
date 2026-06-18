"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Post, Category } from "@/lib/types";
import { getPosts, getCategories } from "@/lib/data/content";
import { PostCard } from "@/components/blog/PostCard";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { SearchBox } from "@/components/blog/SearchBox";
import { button } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

function categoryById(categories: Category[], id: string | null): Category | undefined {
  return categories.find((c) => c.id === id) ?? undefined;
}

export function BlogListClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Dados buscados em runtime na API (publica na hora, sem rebuild).
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let on = true;
    Promise.all([getPosts(), getCategories()]).then(([p, c]) => {
      if (!on) return;
      setPosts(p);
      setCategories(c);
      setLoaded(true);
    });
    return () => {
      on = false;
    };
  }, []);

  // Estado inicial dos filtros lido da URL no cliente (compatível com export estático).
  const [activeCategory, setActiveCategory] = useState(
    () => searchParams.get("categoria") ?? ""
  );
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [page, setPage] = useState(1);

  const updateUrl = useCallback(
    (cat: string, q: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (cat) params.set("categoria", cat);
      else params.delete("categoria");
      if (q) params.set("q", q);
      else params.delete("q");
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handleCategory = (slug: string) => {
    setActiveCategory(slug);
    setPage(1);
    updateUrl(slug, search);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    updateUrl(activeCategory, value);
  };

  const filtered = useMemo(() => {
    const catSlugToId = new Map(categories.map((c) => [c.slug, c.id]));
    let result = posts;
    if (activeCategory) {
      const catId = catSlugToId.get(activeCategory);
      if (catId) result = result.filter((p) => p.category_id === catId);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt ?? "").toLowerCase().includes(q) ||
          (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, categories, activeCategory, search]);

  const paginated = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore = paginated.length < filtered.length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onChange={handleCategory}
        />
        <SearchBox
          value={search}
          onChange={handleSearch}
          className="w-full sm:max-w-xs"
        />
      </div>

      {!loaded ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="h-80 animate-pulse rounded-xl bg-border/30" />
          ))}
        </ul>
      ) : paginated.length === 0 ? (
        <EmptyState hasFilters={!!(activeCategory || search)} />
      ) : (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((post) => (
              <li key={post.id}>
                <PostCard
                  post={post}
                  category={categoryById(categories, post.category_id)}
                />
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className={cn(button.secondary)}
              >
                Carregar mais artigos
              </button>
            </div>
          )}

          <p className="text-center text-sm text-muted">
            Exibindo {paginated.length} de {filtered.length} artigo
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </>
      )}
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-azul-claro/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="text-azul-claro"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-azul-petroleo">
          {hasFilters ? "Nenhum artigo encontrado" : "Nenhum artigo publicado ainda"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {hasFilters
            ? "Tente remover os filtros ou alterar os termos de busca."
            : "Em breve publicaremos conteúdo técnico e especializado."}
        </p>
      </div>
    </div>
  );
}

export default BlogListClient;
