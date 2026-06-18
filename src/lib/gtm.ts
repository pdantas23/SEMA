/**
 * Camada de tracking via GTM dataLayer (mesmo padrão do projeto Forma).
 * Todos os eventos custom do site passam por aqui.
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  }
}

/** Empurra um evento para o dataLayer do GTM. No-op no servidor. */
export function gtmPush(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

/** Evento de clique em WhatsApp — padrão do Forma: { location, message }. */
export function trackWhatsApp(location: string, message = "") {
  gtmPush("whatsapp_click", { location, message });
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("trackCustom", "WhatsAppClick", { location });
  }
}
