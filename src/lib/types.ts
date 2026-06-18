/**
 * Modelo de conteúdo — contrato compartilhado entre data-layer, páginas e admin.
 * Tabelas com sufixo _sema na Supabase compartilhada (blueprint §3).
 * Campos de SEO seguem o briefing §16.
 */

export type UUID = string;

export interface SeoFields {
  seo_title: string | null;
  seo_description: string | null;
  seo_keyword: string | null;
}

export interface Category {
  id: UUID;
  created_at: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Post extends SeoFields {
  id: UUID;
  created_at: string;
  updated_at: string | null;
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  content: string; // markdown/html do corpo
  cover_image: string | null;
  cover_alt: string | null;
  category_id: UUID | null;
  author: string | null;
  tags: string[] | null;
  instagram_url: string | null;
  published: boolean;
  featured: boolean; // destaque na home
  published_at: string | null;
}

export interface NewsItem extends SeoFields {
  id: UUID;
  created_at: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  cover_alt: string | null;
  gallery: string[] | null;
  category_id: UUID | null;
  location: string | null;
  published: boolean;
  featured: boolean;
  published_at: string | null;
}

export interface EventItem extends SeoFields {
  id: UUID;
  created_at: string;
  name: string;
  slug: string;
  description: string;
  cover_image: string | null;
  cover_alt: string | null;
  gallery: string[] | null;
  event_date: string | null;
  location: string | null;
  participants: string | null; // participantes do escritório
  theme: string | null;
  related_link: string | null;
  instagram_url: string | null;
  published: boolean;
  featured: boolean;
}

export interface Area {
  id: UUID;
  created_at: string;
  title: string;
  slug: string;
  summary: string;
  description: string | null;
  icon: string | null; // nome de ícone lucide-react
  order: number;
  published: boolean;
}

export interface TeamMember {
  id: UUID;
  created_at: string;
  name: string;
  role: string | null; // ex.: Sócio, Advogado(a)
  bio: string | null;
  photo: string | null;
  specialties: string[] | null;
  order: number;
  published: boolean;
}

export interface InstagramPost {
  id: UUID;
  created_at: string;
  url: string;
  caption: string | null;
  category_id: UUID | null;
  related_type: "post" | "news" | "event" | null;
  related_id: UUID | null;
}

/** Mensagem de contato (briefing §15). Reusa leads_sema com origem 'site_contato'. */
export interface ContactMessage {
  nome: string;
  email: string;
  whatsapp: string;
  assunto: string;
  mensagem: string;
}

/** Status comercial de um lead (pipeline de vendas). */
export type LeadStatus =
  | "Novo"
  | "Em contato"
  | "Orçamento enviado"
  | "Em negociação"
  | "Fechado"
  | "Perdido";

/** Etiqueta de qualificação de um lead. */
export type LeadEtiqueta = "Qualificado" | "Não qualificado";

/**
 * Lead do CRM — tabela `leads_sema` (compartilhada do tenant). Espelha o schema
 * já em produção no projeto de leads. Centralizado aqui para o CRM do admin.
 */
export interface Lead {
  id: UUID;
  created_at: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  necessidade: string | null;
  faturamento: string | null;
  segmentacao: string | null;
  origem: string | null;
  status_comercial: LeadStatus | null;
  etiqueta: LeadEtiqueta | null;
  consentimento_lgpd: boolean | null;
  consentimento_marketing: boolean | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

/** Papéis em profiles_sema (compartilhada). O blog usa apenas 'admin';
 *  'marketing'/'comercial' pertencem ao dashboard de leads (outro projeto). */
export type AdminRole = "admin" | "marketing" | "comercial";
