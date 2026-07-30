import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import { OG_DEFAULT } from "@/lib/seo";
import { assetPath } from "@/lib/utils";

// Tipografia única da marca (Manual de ID): Montserrat.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.shortName}`,
  },
  description: SITE.description,
  keywords: [
    "advocacia",
    "direito tributário",
    "direito empresarial",
    "direito ambiental",
    "agronegócio",
    "Piauí",
    "Maranhão",
    SITE.shortName,
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.name,
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    // Card institucional (identidade visual) — herdado por toda página que não
    // define imagem própria. Sem isso o WhatsApp escolhe sozinho e acaba
    // pegando o favicon quadrado.
    images: [OG_DEFAULT],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [OG_DEFAULT.url],
  },
  robots: { index: true, follow: true },
  icons: { icon: assetPath("/favicon.png") },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
