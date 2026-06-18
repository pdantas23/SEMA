import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { HomeClient } from "@/components/sections/HomeClient";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
  },
};

export default function HomePage() {
  return <HomeClient />;
}
