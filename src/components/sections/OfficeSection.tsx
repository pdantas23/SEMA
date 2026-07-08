import Link from "next/link";
import { container, section, button, typography } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

/**
 * Seção unificada "Quem somos + Especialidades" — texto corrido, sem cards.
 * Substitui as antigas AreasSection e AboutSnippetSection e as páginas
 * /sobre e /areas (conteúdo institucional fornecido pelo escritório).
 */
export function OfficeSection() {
  return (
    <section
      id="escritorio"
      className={cn(section, "bg-white scroll-mt-16")}
      aria-labelledby="escritorio-heading"
    >
      <div className={container}>
        <p className={cn(typography.eyebrow, "mb-3")}>Quem somos</p>
        <h2 id="escritorio-heading" className={typography.h2}>
          Advocacia técnica, estratégica e especializada
        </h2>

        <div className="mt-6 space-y-5">
          <p className={typography.lead}>
            Fundado em 2017, o escritório Salha, Escórcio, Napoleão e Mendes Advogados está
            preparado para atender às mais elevadas expectativas de pessoas físicas
            e empresas em assuntos jurídicos. É formado por advogados qualificados
            e com rica experiência no contencioso administrativo e judicial nas
            áreas <strong className="font-semibold text-azul-petroleo">tributária</strong>,{" "}
            <strong className="font-semibold text-azul-petroleo">societária e empresarial</strong>,{" "}
            <strong className="font-semibold text-azul-petroleo">ambiental</strong>,{" "}
            <strong className="font-semibold text-azul-petroleo">imobiliária e fundiária</strong> e do{" "}
            <strong className="font-semibold text-azul-petroleo">agronegócio</strong>.
          </p>
          <p className={typography.body}>
            O escritório procura indicar os melhores caminhos para a estruturação
            de negócios e operações de seus clientes, por meio de uma atuação ética
            e focada em resultados. Somado a isso, propõe e acompanha questões
            judiciais e administrativas, com entrega de relatórios periódicos, de
            acordo com as necessidades de informação de cada cliente.
          </p>
          <p className={typography.body}>
            Estabelecemos com cada cliente uma relação de confiança, oferecendo
            sólido conhecimento técnico e atenção às suas características e
            peculiaridades, através de relacionamentos de longo prazo.
          </p>
        </div>

        <div className="mt-8">
          <Link href="/contato" className={button.primary}>
            Fale com o escritório
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
