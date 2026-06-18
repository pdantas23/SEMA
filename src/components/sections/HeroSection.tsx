"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { assetPath, cn } from "@/lib/utils";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { container, button, typography } from "@/lib/design/tokens";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

/** Slide de destaque (artigo, notícia ou evento) exibido após a hero institucional. */
export interface HeroSlide {
  eyebrow: string;
  title: string;
  image: string | null;
  href: string;
  cta: string;
}

interface HeroSectionProps {
  slides?: HeroSlide[];
}

const AUTOPLAY_MS = 6000;

interface SlideShellProps {
  active: boolean;
  image: string;
  imageOpacity: string;
  overlay: string;
  /** Mostra a imagem inteira (sem corte/zoom) sobre um fundo desfocado dela mesma. */
  contain?: boolean;
  priority?: boolean;
  children: React.ReactNode;
}

/** Camada de slide: fundo (imagem + gradiente) e conteúdo centralizado. */
function SlideShell({ active, image, imageOpacity, overlay, contain, priority, children }: SlideShellProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center transition-all duration-700",
        active ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}
      aria-hidden={!active}
    >
      {contain ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            className="object-cover blur-2xl scale-110 opacity-50"
            aria-hidden="true"
          />
          <Image
            src={image}
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </>
      ) : (
        <Image
          src={image}
          alt=""
          fill
          className={cn("object-cover", imageOpacity)}
          priority={priority}
          aria-hidden="true"
        />
      )}
      <div className={cn("absolute inset-0", overlay)} aria-hidden="true" />
      <div className={cn(container, "relative z-10 py-16 lg:py-32")}>{children}</div>
    </div>
  );
}

export function HeroSection({ slides = [] }: HeroSectionProps) {
  const total = 1 + slides.length;
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  // Autoplay contínuo em loop.
  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [total]);

  // Swipe no mobile.
  function handleTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 50) return;
    setIndex((i) => (dx < 0 ? (i + 1) % total : (i - 1 + total) % total));
  }

  const waLink = whatsappLink(WHATSAPP_MESSAGES.default);
  const fallbackBg = assetPath("/images/hero-bg.jpg");

  return (
    <section
      className="relative flex min-h-[78vh] lg:min-h-[90vh] items-center overflow-hidden bg-azul-petroleo"
      aria-roledescription="carrossel"
      aria-label="Apresentação do escritório e destaques"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide 1 — hero institucional (sempre o primeiro do carrossel) */}
      <SlideShell
        active={index === 0}
        image={fallbackBg}
        imageOpacity="opacity-20"
        overlay="bg-gradient-to-r from-azul-petroleo via-azul-petroleo/90 to-azul-petroleo/60"
        priority
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className={cn(typography.eyebrow, "text-azul-claro mb-4")}>
            Direito tributário, empresarial e ambiental
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Assessoria jurídica para
            <br />
            <span className="text-azul-claro">empresas e o agronegócio</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
            Atuamos ao lado de grandes empresas e do agronegócio no Piauí, no
            Maranhão e em todo o Brasil, com a profundidade técnica que cada caso
            exige.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contato"
              className={cn(button.primary, "bg-white text-azul-petroleo hover:bg-branco-gelo text-base px-7 py-3.5")}
            >
              Agende uma consulta
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a
              href={waLink}
              data-wa-location="hero"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(button.whatsapp, "text-base px-7 py-3.5")}
            >
              <WhatsAppIcon size={18} />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </SlideShell>

      {/* Slides de destaque — artigo, notícia e evento mais recentes */}
      {slides.map((slide, i) => (
        <SlideShell
          key={slide.href}
          active={index === i + 1}
          image={slide.image ? assetPath(slide.image) : fallbackBg}
          contain={Boolean(slide.image)}
          imageOpacity={slide.image ? "opacity-100" : "opacity-20"}
          overlay={
            slide.image
              ? "bg-gradient-to-t from-azul-petroleo/90 via-azul-petroleo/40 to-azul-petroleo/20"
              : "bg-gradient-to-r from-azul-petroleo via-azul-petroleo/90 to-azul-petroleo/60"
          }
        >
          <div className="max-w-4xl mx-auto text-center">
            <p className={cn(typography.eyebrow, "text-azul-claro mb-4")}>
              {slide.eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-8 line-clamp-3 drop-shadow-md">
              {slide.title}
            </h2>
            <a
              href={slide.href}
              className={cn(button.primary, "bg-white text-azul-petroleo hover:bg-branco-gelo text-base px-7 py-3.5")}
            >
              {slide.cta}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </SlideShell>
      ))}

      {/* Indicadores */}
      {total > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para o destaque ${i + 1} de ${total}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index ? "w-7 bg-white" : "w-2 bg-white/35 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
