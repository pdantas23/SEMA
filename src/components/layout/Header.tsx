"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV, CONTACT, SOCIAL } from "@/lib/constants";
import { assetPath } from "@/lib/utils";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { container } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waLink = whatsappLink(WHATSAPP_MESSAGES.default);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 shadow-sm backdrop-blur-sm border-b border-border"
          : "bg-white/80 backdrop-blur-sm"
      )}
    >
      <div className={cn(container, "relative flex items-center justify-between h-16")}>
        {/* Logo — centralizado no mobile, à esquerda no desktop */}
        <Link href="/" className="mx-auto lg:mx-0 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-lavanda rounded">
          <Image
            src={assetPath("/logo-sema.png")}
            alt="SENMA — Salha, Escórcio, Napoleão e Mendes Advogados"
            width={140}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Navegação principal">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-azul-lavanda"
                  : "text-azul-petroleo/70 hover:text-azul-petroleo"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <a
            href={waLink}
            data-wa-location="header"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp: ${CONTACT.whatsappDisplay}`}
            className="inline-flex items-center justify-center p-2 rounded-md text-[#25D366] hover:opacity-80 transition-opacity"
          >
            <WhatsAppIcon size={20} />
          </a>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram: ${SOCIAL.instagramHandle}`}
            className="inline-flex items-center justify-center p-2 rounded-md text-azul-petroleo/70 hover:text-azul-petroleo transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>

        {/* Mobile Menu — botão à direita, sem afetar a centralização do logo */}
        <div className="lg:hidden absolute right-5 sm:right-6 top-1/2 -translate-y-1/2">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
