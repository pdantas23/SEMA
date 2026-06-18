import type { Metadata } from "next";
import Link from "next/link";
import { SITE, CONTACT } from "@/lib/constants";
import { containerNarrow, containerHero, section, typography } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: `Política de Privacidade e tratamento de dados pessoais da ${SITE.name}, em conformidade com a LGPD.`,
  robots: { index: false, follow: false },
};

export default function PoliticaDePrivacidadePage() {
  return (
    <>
      <section className="bg-azul-petroleo py-16">
        <div className={cn(containerHero, "text-center")}>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Política de Privacidade
          </h1>
          <p className="mt-3 text-white/60 text-sm">
            Última atualização: junho de 2025
          </p>
        </div>
      </section>

      <section className={cn(section, "bg-white")}>
        <div className={containerNarrow}>
          <div className="prose-sema max-w-none">
            <h2>1. Responsável pelo tratamento</h2>
            <p>
              {SITE.name} ("<strong>{SITE.shortName}</strong>"), escritório de advocacia
              inscrito na OAB, com e-mail de contato{" "}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            </p>

            <h2>2. Dados coletados</h2>
            <p>
              Coletamos apenas os dados fornecidos voluntariamente pelo usuário por meio
              do formulário de contato: nome completo, endereço de e-mail, número de
              WhatsApp, assunto e mensagem.
            </p>
            <p>
              Não coletamos dados sensíveis, não utilizamos cookies de rastreamento
              de terceiros e não vendemos dados pessoais a ninguém.
            </p>

            <h2>3. Finalidade do tratamento</h2>
            <p>
              Os dados são utilizados exclusivamente para:
            </p>
            <ul>
              <li>Responder às solicitações e consultas enviadas pelo formulário;</li>
              <li>Identificar o usuário para prestação dos serviços advocatícios;</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>

            <h2>4. Base legal (LGPD)</h2>
            <p>
              O tratamento está fundado no consentimento (art. 7º, I) e no legítimo
              interesse do escritório em responder às consultas recebidas (art. 7º, IX
              da Lei 13.709/2018 — LGPD).
            </p>

            <h2>5. Compartilhamento de dados</h2>
            <p>
              Os dados podem ser compartilhados com o serviço de banco de dados utilizado
              pelo escritório (Supabase), sujeito a contrato de processamento de dados
              adequado. Não compartilhamos dados pessoais com terceiros para fins
              comerciais ou publicitários.
            </p>

            <h2>6. Prazo de retenção</h2>
            <p>
              Os dados são mantidos pelo período necessário ao atendimento da solicitação
              ou enquanto existir relação com o escritório, podendo ser excluídos mediante
              requisição do titular.
            </p>

            <h2>7. Direitos do titular</h2>
            <p>
              Nos termos da LGPD, o titular dos dados pode, a qualquer momento, solicitar:
            </p>
            <ul>
              <li>Confirmação da existência de tratamento;</li>
              <li>Acesso aos dados;</li>
              <li>Correção de dados incompletos ou desatualizados;</li>
              <li>Anonimização, bloqueio ou eliminação;</li>
              <li>Portabilidade;</li>
              <li>Revogação do consentimento.</li>
            </ul>
            <p>
              Solicitações devem ser encaminhadas ao e-mail{" "}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            </p>

            <h2>8. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais adequadas para proteger os dados
              pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>

            <h2>9. Alterações nesta política</h2>
            <p>
              Esta política pode ser atualizada periodicamente. A versão vigente estará
              sempre disponível nesta página com a data da última atualização.
            </p>

            <h2>10. Contato</h2>
            <p>
              Dúvidas sobre esta política ou sobre o tratamento dos seus dados:{" "}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-azul-petroleo/60 hover:text-azul-petroleo transition-colors"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Voltar ao início
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
