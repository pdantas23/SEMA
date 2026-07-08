/**
 * scripts/seed-data.ts — Conteúdo seed para SEMA_BLOG
 * Importado por seed.ts; não executar diretamente.
 * Tom de voz: sóbrio, técnico, didático, sem juridiquês excessivo.
 * Público-alvo: sócios/diretores de empresas, agronegócio, Piauí/Maranhão.
 */

import { AREAS_SEED } from "../src/lib/constants";

// ---------------------------------------------------------------------------
// Tipos de seed
// ---------------------------------------------------------------------------
export interface CategorySeed {
  name: string;
  slug: string;
  description: string | null;
}

export interface PostSeed {
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  content: string;
  category_slug: string;
  author: string | null;
  tags: string[] | null;
  published: boolean;
  featured: boolean;
  published_at: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keyword: string | null;
}

export interface NewsSeed {
  title: string;
  slug: string;
  content: string;
  location: string | null;
  published: boolean;
  featured: boolean;
  published_at: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keyword: string | null;
}

export interface EventSeed {
  name: string;
  slug: string;
  description: string;
  event_date: string;
  location: string | null;
  participants: string | null;
  theme: string | null;
  published: boolean;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_keyword: string | null;
}

export interface AreaSeed {
  title: string;
  slug: string;
  summary: string;
  description: string | null;
  icon: string | null;
  order: number;
  published: boolean;
}

export interface TeamSeed {
  name: string;
  role: string | null;
  bio: string | null;
  specialties: string[] | null;
  order: number;
  published: boolean;
}

export interface InstagramSeed {
  url: string;
  caption: string | null;
  category_slug: string;
}

// ---------------------------------------------------------------------------
// Dados
// ---------------------------------------------------------------------------

export const CATEGORIES: CategorySeed[] = [
  {
    name: "Tributário",
    slug: "tributario",
    description: "Planejamento fiscal, contencioso tributário e compliance.",
  },
  {
    name: "Trabalhista",
    slug: "trabalhista",
    description: "Relações de trabalho, passivos e conformidade trabalhista.",
  },
  {
    name: "Empresarial",
    slug: "empresarial",
    description: "Estruturação societária, contratos e governança corporativa.",
  },
  {
    name: "Geral",
    slug: "geral",
    description: "Informações institucionais e temas jurídicos transversais.",
  },
];

export const POSTS: PostSeed[] = [
  {
    title: "Planejamento tributário no agronegócio: cuidados essenciais em 2025",
    subtitle: "Como estruturar a carga fiscal da sua operação rural com segurança jurídica",
    slug: "planejamento-tributario-agronegocio-2025",
    excerpt:
      "Produtores rurais e agroindústrias enfrentam um ambiente tributário cada vez mais complexo. Entender as opções de regime fiscal e os limites do planejamento lícito é indispensável para reduzir riscos.",
    content: `## Contexto\n\nO setor do agronegócio responde por parcela significativa do PIB brasileiro e, ao mesmo tempo, é um dos mais afetados por alterações na legislação tributária. A Reforma Tributária (EC 132/2023) e as regulamentações do IBS e CBS impõem atenção redobrada.\n\n## O que é planejamento tributário\n\nPlanejamento tributário é o conjunto de atos lícitos praticados antes do fato gerador para reduzir, postergar ou eliminar a obrigação tributária. Difere da evasão fiscal, que envolve condutas ilícitas após o fato gerador.\n\n## Pontos críticos\n\n**Regime de apuração:** a escolha entre Simples Nacional, Lucro Presumido e Lucro Real determina a alíquota efetiva e as obrigações acessórias.\n\n**Tributação do produtor rural PF:** o produtor que fatura acima de determinado limite deve observar o Funrural e as contribuições previdenciárias.\n\n**Créditos de ICMS e PIS/COFINS:** insumos agropecuários têm tratamento diferenciado; o aproveitamento correto exige mapeamento detalhado da cadeia de produção.\n\n## Como agir\n\n1. Revisar anualmente o regime tributário;\n2. Manter escrituração contábil regular;\n3. Buscar assessoria antes de implementar qualquer estrutura;\n4. Monitorar as regulamentações do IBS/CBS.\n\n## Conclusão\n\nPlanejamento tributário eficaz no agronegócio é resultado de análise criteriosa da operação, do porte do negócio e dos riscos envolvidos. O SENMA assessora produtores e agroindústrias no Piauí e Maranhão com foco em segurança jurídica.`,
    category_slug: "tributario",
    author: "Equipe SENMA",
    tags: ["tributário", "agronegócio", "planejamento fiscal", "reforma tributária"],
    published: true,
    featured: true,
    published_at: "2025-04-10T10:00:00Z",
    seo_title: "Planejamento tributário no agronegócio em 2025 | SENMA Advogados",
    seo_description: "Entenda como estruturar a carga fiscal da sua operação rural com segurança jurídica. Orientações do escritório SENMA.",
    seo_keyword: "planejamento tributário agronegócio",
  },
  {
    title: "Passivos trabalhistas: como identificar e reduzir riscos na sua empresa",
    subtitle: "Uma abordagem preventiva pode evitar autuações e condenações custosas",
    slug: "passivos-trabalhistas-como-reduzir-riscos",
    excerpt:
      "Empresas de médio e grande porte acumulam passivos trabalhistas silenciosos. Identificar essas exposições antes de uma fiscalização ou ação judicial é a estratégia mais eficiente.",
    content: `## O problema dos passivos ocultos\n\nMuitas empresas só percebem a extensão de seus passivos trabalhistas quando já estão diante de uma ação judicial ou autuação. Até lá, os valores podem ter se multiplicado com multas, juros e honorários.\n\n## Principais fontes de passivo\n\n**Horas extras não pagas:** o controle de jornada deficiente é uma das causas mais frequentes de condenações.\n\n**Equiparação salarial:** funcionários que exercem as mesmas funções com igual produtividade têm direito à mesma remuneração. Diferenças sem justificativa documentada geram risco.\n\n**Terceirização inadequada:** a tomadora responde subsidiariamente por obrigações não cumpridas pela prestadora.\n\n**Enquadramento sindical incorreto:** o sindicato correto define piso salarial e benefícios obrigatórios.\n\n## Abordagem preventiva\n\n1. Auditoria trabalhista completa;\n2. Adequação de sistemas de ponto e banco de horas;\n3. Revisão dos contratos de terceirização;\n4. Treinamento de gestores.\n\n## Conclusão\n\nA prevenção sempre sai mais barata do que o contencioso. O SENMA oferece assessoria trabalhista preventiva a empresas que buscam conformidade antes que os riscos se tornem processos.`,
    category_slug: "trabalhista",
    author: "Equipe SENMA",
    tags: ["trabalhista", "passivo trabalhista", "gestão de riscos", "auditoria"],
    published: true,
    featured: false,
    published_at: "2025-03-20T10:00:00Z",
    seo_title: "Como reduzir passivos trabalhistas na sua empresa | SENMA Advogados",
    seo_description: "Identifique e mitigue riscos trabalhistas com uma abordagem preventiva. Assessoria especializada do escritório SENMA.",
    seo_keyword: "passivos trabalhistas empresas",
  },
  {
    title: "Holding familiar: vantagens, cuidados e quando faz sentido constituir",
    subtitle: "A estrutura pode oferecer proteção patrimonial e eficiência tributária — mas exige análise técnica",
    slug: "holding-familiar-vantagens-e-cuidados",
    excerpt:
      "A holding familiar ganhou popularidade como ferramenta de planejamento patrimonial e sucessório. Compreender quando ela se aplica e quais são seus limites é fundamental para uma decisão bem informada.",
    content: `## O que é uma holding familiar\n\nHolding familiar é uma pessoa jurídica constituída para deter participações societárias, imóveis ou outros ativos de uma família, centralizando a gestão do patrimônio e facilitando a transmissão para herdeiros.\n\n## Vantagens potenciais\n\n**Planejamento sucessório:** a participação dos herdeiros pode ser estruturada com doação de cotas em vida, respeitando o ITCMD e evitando o inventário judicial.\n\n**Proteção patrimonial:** em algumas estruturas, os bens aportados ficam protegidos de credores pessoais dos sócios, com limitações legais relevantes.\n\n**Governança:** regras de administração e mecanismos de resolução de conflitos podem ser estabelecidos no contrato social.\n\n## Cuidados essenciais\n\n**Nem sempre é vantajosa tributariamente:** o benefício fiscal depende do regime, da natureza dos ativos e da origem das receitas.\n\n**Risco de fraude à execução:** constituir holding para blindar patrimônio de dívidas já existentes é ineficaz e pode configurar fraude.\n\n**Custo de manutenção:** obrigações contábeis e societárias recorrentes podem superar os benefícios para patrimônios menores.\n\n## Quando faz sentido\n\n- Patrimônio relevante (imóveis, participações, ativos rurais);\n- Sucessão planejada com múltiplos herdeiros;\n- Necessidade de governança estruturada.\n\n## Conclusão\n\nO SENMA realiza estudo de viabilidade completo antes de qualquer recomendação sobre holding familiar.`,
    category_slug: "empresarial",
    author: "Equipe SENMA",
    tags: ["holding familiar", "planejamento sucessório", "direito empresarial", "patrimônio"],
    published: true,
    featured: false,
    published_at: "2025-02-14T10:00:00Z",
    seo_title: "Holding familiar: vantagens e cuidados | SENMA Advogados",
    seo_description: "Entenda quando constituir uma holding familiar faz sentido e quais são os cuidados jurídicos e tributários necessários.",
    seo_keyword: "holding familiar vantagens",
  },
];

export const NEWS: NewsSeed[] = [
  {
    title: "SENMA participa do Fórum Jurídico do Agronegócio no Piauí",
    slug: "sema-forum-juridico-agronegocio-piaui",
    content: `O escritório Salha, Escórcio, Napoleão e Mendes Advogados marcou presença no Fórum Jurídico do Agronegócio em Teresina. O evento reuniu produtores rurais, representantes do setor público e profissionais do Direito para debater os impactos da Reforma Tributária e os desafios do compliance ambiental no campo.\n\nA equipe da SENMA apresentou painel sobre planejamento tributário para o agronegócio, com destaque para oportunidades e riscos trazidos pela regulamentação do IBS e da CBS.`,
    location: "Teresina, PI",
    published: true,
    featured: true,
    published_at: "2025-05-15T10:00:00Z",
    seo_title: "SENMA no Fórum Jurídico do Agronegócio no Piauí | Notícias",
    seo_description: "O escritório SENMA participou do Fórum Jurídico do Agronegócio em Teresina, apresentando painel sobre planejamento tributário.",
    seo_keyword: "fórum jurídico agronegócio Piauí",
  },
  {
    title: "Reforma Tributária: o que muda para empresas do Maranhão",
    slug: "reforma-tributaria-o-que-muda-maranhao",
    content: `A implementação gradual da Reforma Tributária traz mudanças relevantes para empresas sediadas no Maranhão, especialmente as que operam com benefícios fiscais estaduais de ICMS.\n\nCom a criação do IBS e da CBS, os benefícios de ICMS dos estados serão gradualmente substituídos. O SENMA recomenda que empresas dependentes de incentivos estaduais realizem diagnóstico técnico nos próximos meses.`,
    location: "São Luís, MA",
    published: true,
    featured: false,
    published_at: "2025-04-28T10:00:00Z",
    seo_title: "Reforma Tributária: impactos para empresas do Maranhão | SENMA",
    seo_description: "Entenda como a Reforma Tributária afeta empresas sediadas no Maranhão e os cuidados necessários no período de transição.",
    seo_keyword: "reforma tributária Maranhão empresas",
  },
];

export const EVENTS: EventSeed[] = [
  {
    name: "Workshop: Compliance Trabalhista para Empresas do Agronegócio",
    slug: "workshop-compliance-trabalhista-agronegocio",
    description: `O SENMA promoveu workshop fechado sobre compliance trabalhista voltado a gestores de RH e sócios de empresas do agronegócio no Piauí.\n\nForam abordados contratos de safra, trabalho rural intermitente, controle de jornada, terceirização e auditoria preventiva. Os participantes receberam checklist de conformidade adaptado às operações agrícolas e pecuárias da região.`,
    event_date: "2025-06-05T09:00:00Z",
    location: "Teresina, PI",
    participants: "Sócios do SENMA e consultores especializados",
    theme: "Compliance Trabalhista",
    published: true,
    featured: true,
    seo_title: "Workshop Compliance Trabalhista Agronegócio | SENMA Advogados",
    seo_description: "Workshop sobre compliance trabalhista para empresas do agronegócio no Piauí, promovido pelo escritório SENMA.",
    seo_keyword: "compliance trabalhista agronegócio workshop",
  },
];

export const AREAS: AreaSeed[] = AREAS_SEED.map((a, i) => ({
  title: a.title,
  slug: a.slug,
  summary: a.summary,
  description: null,
  icon: a.icon,
  order: i + 1,
  published: true,
}));

export const TEAM: TeamSeed[] = [
  {
    name: "Dr. Salha",
    role: "Sócio",
    bio: "Advogado com atuação destacada em Direito Tributário e Empresarial. Assessora grandes contribuintes e empresas familiares no planejamento fiscal e na estruturação societária. Pós-graduado em Direito Tributário.",
    specialties: ["Direito Tributário", "Planejamento Societário", "Holding Familiar"],
    order: 1,
    published: true,
  },
  {
    name: "Dr. Escórcio",
    role: "Sócio",
    bio: "Advogado especialista em Direito do Trabalho e Direito Empresarial, com foco em assessoria preventiva a empresas de médio e grande porte. Atua no contencioso trabalhista e na estruturação de relações de emprego conformes.",
    specialties: ["Direito Trabalhista", "Conformidade Empresarial", "Contencioso"],
    order: 2,
    published: true,
  },
  {
    name: "Dr. Mendes",
    role: "Sócio",
    bio: "Advogado com expertise em Direito Ambiental e Direito do Agronegócio. Assessora produtores rurais, agroindústrias e empresas na obtenção de licenças ambientais e na gestão de riscos regulatórios.",
    specialties: ["Direito Ambiental", "Agronegócio", "Licenciamento"],
    order: 3,
    published: true,
  },
];

export const INSTAGRAM: InstagramSeed[] = [
  {
    url: "https://www.instagram.com/p/exemplo-tributario/",
    caption:
      "A Reforma Tributária traz mudanças que impactam diretamente empresas do agronegócio. Nosso time acompanha cada regulamentação para garantir segurança jurídica. #direitotributario #agronegocio #semaadvocacia",
    category_slug: "tributario",
  },
  {
    url: "https://www.instagram.com/p/exemplo-trabalhista/",
    caption:
      "Compliance trabalhista não é burocracia — é proteção para o seu negócio. Identifique riscos antes que eles virem processos. #trabalhista #compliance #semaadvocacia",
    category_slug: "trabalhista",
  },
];
