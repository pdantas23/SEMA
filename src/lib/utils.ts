import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina classes Tailwind com merge inteligente (padrão RoyalHub). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Prefixa o basePath em assets de public/.
 * Em export estático com basePath, next/image (unoptimized) NÃO prefixa sozinho,
 * então TODO caminho de asset deve passar por aqui. (blueprint §2/§4)
 */
export function assetPath(path: string): string {
  // URLs absolutas (ex.: imagens hospedadas no Supabase) passam intactas.
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
