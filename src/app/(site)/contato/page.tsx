import type { Metadata } from "next";
import { SITE, CONTACT, SOCIAL } from "@/lib/constants";
import { whatsappLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import {
  container,
  containerHero,
  section,
  typography,
} from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import {
  Mail, Clock, MapPin,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contato",
  description: `Entre em contato com a ${SITE.name}. Formulário, WhatsApp, e-mail e endereço.`,
};

export default function ContatoPage() {
  const waLink = whatsappLink(WHATSAPP_MESSAGES.contato);

  return (
    <>
      {/* Hero */}
      <section className="bg-azul-petroleo py-20 lg:py-24">
        <div className={cn(containerHero, "text-center")}>
          <p className={cn(typography.eyebrow, "text-azul-claro mb-4")}>Atendimento</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-5">
            Entre em Contato
          </h1>
          <p className="text-lg text-white/65 leading-relaxed max-w-2xl mx-auto">
            Preencha o formulário ou escolha o canal de preferência. Respondemos
            em horário comercial, com atenção e objetividade.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className={cn(section, "bg-white")} aria-label="Formulário e informações de contato">
        <div className={container}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Form — 3/5 */}
            <div className="lg:col-span-3">
              <h2 className={cn(typography.h2, "mb-6")}>Envie uma mensagem</h2>
              <ContactForm />
            </div>

            {/* Info — 2/5 */}
            <aside className="lg:col-span-2">
              <h2 className={cn(typography.h2, "mb-6 text-center")}>Outros canais</h2>
              <ul className="space-y-6 max-w-sm mx-auto">
                <li className="flex items-start gap-3">
                  <WhatsAppIcon size={20} className="shrink-0 mt-0.5 text-azul-petroleo" />
                  <div>
                    <p className="text-sm font-semibold text-azul-petroleo">WhatsApp</p>
                    <a
                      href={waLink}
                      data-wa-location="contato_aside"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-azul-petroleo/70 hover:text-azul-petroleo transition-colors"
                    >
                      {CONTACT.whatsappDisplay}
                    </a>
                    <p className="text-xs text-muted mt-0.5">Resposta rápida em horário comercial</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Mail size={20} className="shrink-0 mt-0.5 text-azul-petroleo" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-azul-petroleo">E-mail</p>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="text-sm text-azul-petroleo/70 hover:text-azul-petroleo transition-colors break-all"
                    >
                      {CONTACT.email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <MapPin size={20} className="shrink-0 mt-0.5 text-azul-petroleo" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-azul-petroleo">Endereço</p>
                    <p className="text-sm text-azul-petroleo/70 leading-relaxed">
                      {CONTACT.address.full}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{CONTACT.address.state}</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Clock size={20} className="shrink-0 mt-0.5 text-azul-petroleo" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-azul-petroleo">Horário de atendimento</p>
                    <p className="text-sm text-azul-petroleo/70">{CONTACT.hours}</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-azul-petroleo" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-azul-petroleo">Instagram</p>
                    <a
                      href={SOCIAL.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-azul-petroleo/70 hover:text-azul-petroleo transition-colors"
                    >
                      {SOCIAL.instagramHandle}
                    </a>
                  </div>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
