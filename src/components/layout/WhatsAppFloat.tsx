"use client";

import { usePathname } from "next/navigation";
import { whatsappLinkForPath } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

export function WhatsAppFloat() {
  const pathname = usePathname();
  const href = whatsappLinkForPath(pathname);

  return (
    <a
      href={href}
      data-wa-location="floating"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className="wa-pulse fixed bottom-6 right-5 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <WhatsAppIcon size={28} className="text-white" />
    </a>
  );
}

export default WhatsAppFloat;
