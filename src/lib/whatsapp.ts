import { CONTACT } from "./constants";

/**
 * Geração canônica de links de WhatsApp (blueprint §4/§6).
 * Número via env (NEXT_PUBLIC_WHATSAPP_NUMBER) com fallback nas constantes.
 */
const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? CONTACT.whatsapp;

export function whatsappLink(message: string, number: string = NUMBER): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}

/** Mensagens por contexto — zero string mágica. */
export const WHATSAPP_MESSAGES = {
  default:
    "Olá! Vim pelo site da SEMA Advogados e gostaria de falar com o escritório.",
  contato:
    "Olá! Gostaria de tirar uma dúvida jurídica com a SEMA Advogados.",
  area: (area: string) =>
    `Olá! Tenho interesse na área de ${area} e gostaria de falar com a SEMA Advogados.`,
  post: (titulo: string) =>
    `Olá! Li o conteúdo "${titulo}" no site da SEMA e gostaria de saber mais.`,
} as const;

/** Resolve a mensagem adequada a partir do path atual. */
export function whatsappLinkForPath(path: string): string {
  if (path.startsWith("/contato")) return whatsappLink(WHATSAPP_MESSAGES.contato);
  return whatsappLink(WHATSAPP_MESSAGES.default);
}
