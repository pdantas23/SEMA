"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  active: string;
  onChange: (slug: string) => void;
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <nav aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("")}
        className={cn(
          "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
          active === ""
            ? "border-azul-petroleo bg-azul-petroleo text-white"
            : "border-border bg-surface text-azul-petroleo hover:border-azul-lavanda hover:text-azul-lavanda"
        )}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.slug)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            active === cat.slug
              ? "border-azul-lavanda bg-azul-lavanda text-white"
              : "border-border bg-surface text-azul-petroleo hover:border-azul-lavanda hover:text-azul-lavanda"
          )}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  );
}

export default CategoryFilter;
