import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { EventDetailClient } from "@/components/events/EventDetailClient";

// SPA: shell estático único; o slug real vem da URL em runtime (client busca na API).
// Slugs reais caem aqui via rewrite no .htaccess — sem rebuild ao publicar.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: "_" }];
}

export const metadata: Metadata = {
  title: "Eventos",
  description: `Eventos e presença institucional da ${SITE.name}.`,
};

export default function EventoPage() {
  return <EventDetailClient />;
}
