/**
 * Tokens de design compartilhados (blueprint §5).
 * Strings de classe reutilizáveis — container, botões, tipografia — num só lugar.
 * Tom: sóbrio, institucional, sem poluição. Cores da marca via utilitários Tailwind.
 */

export const container = "mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8";
export const containerNarrow = "mx-auto w-full max-w-3xl px-5 sm:px-6";
/** Largura padrão dos heros (texto centralizado, até max-w-4xl). */
export const containerHero = "mx-auto w-full max-w-4xl px-5 sm:px-6";

export const button = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-md bg-azul-petroleo px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-azul-lavanda focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-lavanda disabled:opacity-60",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-md border border-azul-lavanda px-5 py-3 text-sm font-semibold text-azul-lavanda transition-colors hover:bg-azul-lavanda hover:text-white",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-azul-petroleo transition-colors hover:text-azul-lavanda",
  whatsapp:
    "inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-colors hover:brightness-95",
} as const;

export const typography = {
  /** Título de seção (sóbrio, peso forte, sem exageros). */
  h1: "text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-azul-petroleo",
  h2: "text-2xl sm:text-3xl font-bold tracking-tight text-azul-petroleo",
  h3: "text-xl font-semibold text-azul-petroleo",
  eyebrow:
    "text-sm font-semibold uppercase tracking-widest text-azul-claro",
  lead: "text-lg text-azul-petroleo/80 leading-relaxed",
  body: "text-base text-azul-petroleo/80 leading-relaxed",
  muted: "text-sm text-muted",
} as const;

export const card =
  "rounded-xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md";

export const section = "py-16 sm:py-20 lg:py-24";
