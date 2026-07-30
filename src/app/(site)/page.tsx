import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { OG_DEFAULT, canonicalUrl } from "@/lib/seo";
import { HomeClient } from "@/components/sections/HomeClient";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: canonicalUrl("/") },
  openGraph: {
    // `type` também precisa ser repetido: o openGraph da página substitui o do
    // layout por inteiro, e sem isso a tag saía vazia.
    type: "website",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: canonicalUrl("/"),
    // Declarado aqui de propósito: no Next, o openGraph da página SUBSTITUI o do
    // layout — sem esta linha o card perderia a imagem da marca.
    images: [OG_DEFAULT],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
