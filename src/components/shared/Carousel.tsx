"use client";

import { assetPath, cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface CarouselProps {
  images: string[];
  alt?: string;
}

/**
 * Carrossel manual de fotos (notícias e eventos).
 * Navegação apenas por setas/indicadores — sem autoplay.
 * Sem imagens cadastradas, não renderiza nada (nem placeholder).
 */
export function Carousel({ images, alt = "Foto" }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  if (images.length === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  // Swipe no mobile.
  function handleTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) next();
    else prev();
  }

  return (
  <div role="group" aria-roledescription="carrossel" aria-label={alt}>
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {images.length > 1 && (
        <button
          type="button"
          aria-label="Foto anterior"
          onClick={prev}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-azul-petroleo/10 bg-white text-azul-petroleo shadow-md transition-colors hover:bg-azul-claro/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-lavanda"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
      )}

      <div
        className="relative min-w-0 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          key={images[index]}
          src={assetPath(images[index])}
          alt={`${alt} — foto ${index + 1} de ${images.length}`}
          width={1600}
          height={900}
          sizes="(max-width: 768px) 100vw, 768px"
          className="h-auto max-h-[70vh] w-auto max-w-full rounded-xl"
        />
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-azul-petroleo/70 px-2.5 py-0.5 text-xs font-medium text-white">
            {index + 1} / {images.length}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <button
          type="button"
          aria-label="Próxima foto"
          onClick={next}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-azul-petroleo/10 bg-white text-azul-petroleo shadow-md transition-colors hover:bg-azul-claro/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-lavanda"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      )}
    </div>

    {images.length > 1 && (
      <div className="mt-3 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir para a foto ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index
                ? "w-6 bg-azul-lavanda"
                : "w-2 bg-azul-petroleo/20 hover:bg-azul-petroleo/40"
            )}
          />
        ))}
      </div>
    )}
  </div>
);
};
export default Carousel;
