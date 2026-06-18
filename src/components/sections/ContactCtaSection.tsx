import Link from "next/link";
import { CONTACT } from "@/lib/constants";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { container, button, typography } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { ArrowRight, Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

export function ContactCtaSection() {
  const waLink = whatsappLink(WHATSAPP_MESSAGES.contato);

  return (
    <section
      className="bg-branco-gelo py-16 sm:py-20"
      aria-labelledby="cta-heading"
    >
      <div className={cn(container, "text-center")}>
        <p className={cn(typography.eyebrow, "mb-3")}>
          Entre em contato
        </p>
        <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold text-azul-petroleo tracking-tight mb-5">
          Fale com um advogado especialista
        </h2>
        <p className="text-azul-petroleo/70 text-base leading-relaxed max-w-xl mx-auto mb-10">
          Agende uma consulta ou tire suas dúvidas. Respondemos em horário comercial
          e prezamos pelo atendimento direto, ágil e especializado.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xs sm:max-w-none mx-auto">
          <Link
            href="/contato"
            className={cn(button.primary, "w-full sm:w-auto")}
          >
            Enviar mensagem
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a
            href={waLink}
            data-wa-location="cta_section"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(button.whatsapp, "w-full sm:w-auto")}
          >
            <WhatsAppIcon size={16} />
            WhatsApp
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className={cn(button.secondary, "w-full sm:w-auto")}
          >
            <Mail size={16} aria-hidden="true" />
            E-mail
          </a>
        </div>
      </div>
    </section>
  );
}
