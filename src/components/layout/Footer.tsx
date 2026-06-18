import Link from "next/link";
import Image from "next/image";
import { SITE, CONTACT, SOCIAL, NAV, AREAS_SEED } from "@/lib/constants";
import { assetPath } from "@/lib/utils";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { container } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

const footerNav = NAV.filter((n) => n.href !== "/blog" && n.href !== "/noticias" && n.href !== "/eventos");

export function Footer() {
  const waLink = whatsappLink(WHATSAPP_MESSAGES.default);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-azul-petroleo text-white/80">
      <div className={cn(container, "py-14 lg:py-16")}>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 text-center">
          {/* Coluna 1 — Marca */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src={assetPath("/logo-sema.png")}
                alt={SITE.name}
                width={130}
                height={38}
                className="h-9 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/60 mx-auto max-w-xs">
              {SITE.description}
            </p>
          </div>

          {/* Coluna 2 — Links Rápidos */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Navegação
            </h3>
            <ul className="space-y-2">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/politica-de-privacidade"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 — Áreas */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Áreas de Atuação
            </h3>
            <ul className="space-y-2">
              {AREAS_SEED.map((area) => (
                <li key={area.slug}>
                  <Link
                    href="/#escritorio"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4 — Contato */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Contato
            </h3>
            <ul className="space-y-3 inline-block text-left max-w-[16rem]">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="shrink-0 mt-0.5 text-azul-claro" aria-hidden="true" />
                <span className="text-sm text-white/60 leading-relaxed">
                  {CONTACT.address.full}
                </span>
              </li>
              {CONTACT.phone !== "PENDENTE" && (
                <li className="flex items-center gap-2.5">
                  <Phone size={14} className="shrink-0 text-azul-claro" aria-hidden="true" />
                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {CONTACT.phone}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <WhatsAppIcon size={14} className="shrink-0 text-azul-claro" />
                <a
                  href={waLink}
                  data-wa-location="footer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {CONTACT.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="shrink-0 text-azul-claro" aria-hidden="true" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={14} className="shrink-0 text-azul-claro" aria-hidden="true" />
                <span className="text-sm text-white/60">{CONTACT.hours}</span>
              </li>
              <li className="flex items-center gap-2.5">
                {/* Instagram icon (inline SVG — lucide-react v1 does not include brand icons) */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-azul-claro" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {SOCIAL.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className={cn(container, "flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 py-5 text-center")}>
          <p className="text-xs text-white/40">
            &copy; {year} {SITE.name}. Todos os direitos reservados.
          </p>
          <p className="text-xs text-white/30">
            OAB — Advocacia especializada no Piauí, Maranhão e Brasil.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
