/**
 * Fonte ÚNICA de contatos / endereços / links / textos institucionais.
 * Zero string mágica espalhada (blueprint §4).
 * Itens não confirmados pelo cliente ficam marcados como PENDENTE.
 */

export const SITE = {
  name: "Salha, Escórcio, Napoleão e Mendes Advogados",
  shortName: "SENMA",
  tagline: "Advocacia técnica, estratégica e especializada",
  description:
    "Escritório de advocacia técnico e especializado em Direito Tributário, Empresarial e Ambiental, com atuação voltada a grandes empresas e ao agronegócio no Piauí, Maranhão e em todo o Brasil.",
  // URL de produção (domínio raiz). Configurável via NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sema.adv.br",
  slug: "sema",
} as const;

export const CONTACT = {
  // WhatsApp herdado do projeto anterior — PENDENTE confirmar se é o número do escritório.
  whatsapp: "5586983200244",
  whatsappDisplay: "(86) 98320-0244",
  email: "semaadvocacia@gmail.com",
  phone: "PENDENTE",
  // Endereço físico do escritório.
  address: {
    street: "Rua Deputado Sousa Santos, 853 — São Cristóvão",
    city: "Teresina",
    state: "PI",
    zip: "64052-370",
    full: "Rua Deputado Sousa Santos, 853 — São Cristóvão, Teresina - PI, 64052-370",
  },
  hours: "Seg a Sex, 8h às 18h", // PENDENTE confirmar
} as const;

export const SOCIAL = {
  instagram: "https://instagram.com/sema.advogados",
  instagramHandle: "@sema.advogados",
  linkedin: "PENDENTE",
} as const;

/** Itens de navegação do cabeçalho (briefing §3). */
export const NAV = [
  { label: "Início", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Notícias", href: "/noticias" },
  { label: "Eventos", href: "/eventos" },
  { label: "Contato", href: "/contato" },
] as const;

/**
 * Áreas de atuação — conteúdo estático, alinhado às especialidades dos
 * profissionais do escritório (não editável no admin).
 * Tom de voz: sóbrio, técnico, objetivo, sem juridiquês excessivo.
 */
export const AREAS_SEED = [
  {
    slug: "tributario",
    title: "Direito Tributário",
    summary:
      "Planejamento e contencioso tributário com visão estratégica, prevenção de riscos e segurança jurídica para empresas, indústrias e o agronegócio.",
    icon: "Landmark",
  },
  {
    slug: "societario-empresarial",
    title: "Direito Societário e Empresarial",
    summary:
      "Estruturação societária, reorganizações, contratos, acordos de sócios e governança para empresas de todos os portes.",
    icon: "Building2",
  },
  {
    slug: "ambiental",
    title: "Direito Ambiental",
    summary:
      "Conformidade ambiental, licenciamento e gestão de riscos para o agronegócio e a indústria.",
    icon: "Leaf",
  },
  {
    slug: "imobiliario-fundiario",
    title: "Direito Imobiliário e Fundiário",
    summary:
      "Regularização fundiária, due diligence imobiliária e segurança jurídica para propriedades rurais e urbanas.",
    icon: "ScrollText",
  },
  {
    slug: "agronegocio",
    title: "Agronegócio",
    summary:
      "Assessoria jurídica completa ao agronegócio — do crédito rural à conformidade tributária, ambiental e fundiária.",
    icon: "Wheat",
  },
] as const;

/**
 * Equipe — conteúdo estático fornecido pelo escritório.
 * Fotos em /public/images/<nome>/<nome>.jpg. Esta seção não é editável no admin.
 */
export const TEAM_SEED = [
  {
    name: "Philippe Salha",
    role: "Advogado e Engenheiro Civil",
    photo: "/images/philippe/philippe.jpg",
    bio: "Especialista em Gestão Fiscal. Ex-Auditor Fiscal da Fazenda do Estado do Piauí, ex-Superintendente Regional do Trabalho no Estado do Piauí e ex-membro do TARF/PI. Atuou como presidente da COTAC – Comissão Técnica de Apoio ao CODIN na SEDET/PI (Conselho de Desenvolvimento Industrial do Estado do Piauí, que trata dos incentivos fiscais para as indústrias no âmbito do Estado do Piauí).",
  },
  {
    name: "Abel Escórcio",
    role: "Advogado e Consultor Tributário",
    photo: "/images/abel/abel.jpg",
    bio: "Mestre e especialista em Direito Tributário pelo IBET. Professor de direito tributário na pós-graduação do IBET – Teresina. Pesquisador da Associação Paulista de Estudos Tributários – APET. Integrou o Conselho de Contribuintes do Município de Teresina como Conselheiro.",
  },
  {
    name: "Frederico Mendes",
    role: "Advogado",
    photo: "/images/frederico/frederico.jpg",
    bio: "Especialista em Direito Tributário pelo IBET. Membro do Instituto Brasileiro de Direito Tributário – IBDT e do Comitê Tributário da Sociedade Rural Brasileira – SRB. Atuou como julgador do TARF/PI e atualmente é Diretor de Assuntos Legislativos e Tributários do Centro das Indústrias do Estado do Piauí – CIEPI.",
  },
  {
    name: "Victor Napoleão",
    role: "Advogado",
    photo: "/images/victor/victor.jpg",
    bio: "Pós-graduado pela UFPI. Especialista em Direito Ambiental pela FGV-PR. Membro da comissão de direito ambiental da OAB/PI. Especialista em Direito Imobiliário e do Agronegócio. Advogado da Associação dos Analistas do Tribunal de Justiça do Piauí. Conselheiro do Conselho de Contribuintes de Teresina-PI.",
  },
] as const;

/** Tracking — IDs em env (vazio = desativado). */
export const TRACKING = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
} as const;
