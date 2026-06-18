import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { Analytics } from "@/components/shared/Analytics";

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="page-root flex min-h-screen flex-col">
      <Analytics />
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
