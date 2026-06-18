"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Embed responsivo de post do Instagram (briefing §9).
 * Usado em posts do blog, em eventos e na home. Carrega o embed.js oficial uma
 * vez e processa os blockquotes. Tolerante a falha (rede/bloqueio).
 *
 * - `bare`: remove margens/centralização externas para encaixar dentro de um card.
 */
declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const EMBED_SRC = "https://www.instagram.com/embed.js";

/**
 * Normaliza o permalink para o formato que o embed.js aceita:
 * remove query string/hash (ex.: ?utm_source=ig_web_copy_link) e garante a
 * barra final. Mantém o caminho /p/ ou /reel/.
 */
function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  const clean = trimmed.split(/[?#]/)[0];
  return clean.endsWith("/") ? clean : `${clean}/`;
}

export function InstagramEmbed({ url, bare = false }: { url: string; bare?: boolean }) {
  const ref = useRef<HTMLQuoteElement>(null);
  const [loaded, setLoaded] = useState(false);
  const permalink = normalizeUrl(url);

  useEffect(() => {
    setLoaded(false);
    const process = () => {
      window.instgrm?.Embeds?.process();
      // Dá tempo do iframe montar antes de esconder o skeleton.
      window.setTimeout(() => setLoaded(true), 900);
    };
    if (window.instgrm) {
      process();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${EMBED_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", process);
      return () => existing.removeEventListener("load", process);
    }
    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.async = true;
    script.onload = process;
    document.body.appendChild(script);
  }, [permalink]);

  return (
    <div className={bare ? "w-full" : "mx-auto my-6 flex w-full justify-center"}>
      <div className="relative w-full" style={{ maxWidth: bare ? "100%" : 540 }}>
        {/* Skeleton enquanto o embed carrega */}
        {!loaded && (
          <div
            className="absolute inset-0 z-10 flex flex-col gap-3 overflow-hidden rounded-lg bg-white p-4"
            aria-hidden="true"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded-full bg-azul-petroleo/10" />
              <div className="h-3 w-28 animate-pulse rounded bg-azul-petroleo/10" />
            </div>
            <div className="flex-1 animate-pulse rounded-md bg-azul-petroleo/10" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-azul-petroleo/10" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-azul-petroleo/10" />
          </div>
        )}

        <blockquote
          ref={ref}
          className="instagram-media"
          data-instgrm-permalink={permalink}
          data-instgrm-version="14"
          style={{ maxWidth: 540, width: "100%", margin: 0, minHeight: 480 }}
        >
          <a href={permalink} target="_blank" rel="noopener noreferrer">
            Ver publicação no Instagram
          </a>
        </blockquote>
      </div>
    </div>
  );
}

export default InstagramEmbed;
