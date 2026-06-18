"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { NAV, CONTACT, SOCIAL } from "@/lib/constants";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Portal só renderiza no client (evita mismatch de hidratação)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const waLink = whatsappLink(WHATSAPP_MESSAGES.default);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        className="inline-flex items-center justify-center p-2 rounded-md text-azul-petroleo hover:text-azul-lavanda transition-colors"
      >
        {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
      </button>

      {/* Overlay + Drawer via portal no body — fora do containing block do header
          (o backdrop-blur do header quebraria o posicionamento fixed) */}
      {mounted &&
        createPortal(
          <div className="lg:hidden">
            {/* Overlay */}
            {open && (
              <div
                className="fixed inset-0 z-40 bg-azul-petroleo/20 backdrop-blur-sm"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
            )}

            {/* Drawer */}
            <div
              className={cn(
                "fixed top-16 right-0 bottom-0 z-50 w-72 bg-white shadow-xl transition-transform duration-300 flex flex-col",
                open ? "translate-x-0" : "translate-x-full"
              )}
              aria-hidden={!open}
            >
        <nav
          className="flex-1 overflow-y-auto px-4 py-6"
          aria-label="Menu mobile"
        >
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-azul-petroleo/5 text-azul-lavanda"
                      : "text-azul-petroleo hover:bg-azul-petroleo/5"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border px-4 py-5 space-y-3">
          <a
            href={waLink}
            data-wa-location="mobile_menu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full justify-center rounded-md bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:brightness-95 transition-all"
          >
            <WhatsAppIcon size={16} />
            {CONTACT.whatsappDisplay}
          </a>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-azul-petroleo/70 hover:text-azul-petroleo transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            {SOCIAL.instagramHandle}
          </a>
        </div>
      </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default MobileMenu;
