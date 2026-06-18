"use client";

import { cn } from "@/lib/utils";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchBox({ value, onChange, className }: SearchBoxProps) {
  return (
    <div className={cn("relative", className)}>
      <label htmlFor="blog-search" className="sr-only">
        Buscar posts
      </label>
      <input
        id="blog-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar artigos..."
        className={cn(
          "w-full rounded-md border border-border bg-surface px-4 py-2.5 pr-10",
          "text-sm text-azul-petroleo placeholder:text-muted",
          "transition-colors focus:border-azul-lavanda focus:outline-none focus:ring-2 focus:ring-azul-lavanda/20"
        )}
      />
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </div>
  );
}

export default SearchBox;
