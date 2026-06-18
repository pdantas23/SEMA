"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { TRACKING } from "@/lib/constants";
import { gtmPush, trackWhatsApp } from "@/lib/gtm";

/**
 * Tracking do site (padrão do projeto Forma).
 * - Carrega o GTM (e o Meta Pixel, se configurado) — gated por env.
 * - Dispara `page_view` a cada mudança de rota (SPA).
 * - Captura TODO clique em link de WhatsApp do site (delegação no document),
 *   empurrando `whatsapp_click` { location, message } — funciona em páginas
 *   server e client sem instrumentar cada link individualmente.
 *
 * Ative definindo NEXT_PUBLIC_GTM_ID (e, opcional, NEXT_PUBLIC_META_PIXEL_ID).
 */
export function Analytics() {
  const pathname = usePathname();
  const { gtmId, metaPixelId } = TRACKING;

  // page_view a cada navegação.
  useEffect(() => {
    gtmPush("page_view", { page_path: pathname });
  }, [pathname]);

  // Captura global de cliques em WhatsApp (qualquer <a href*="wa.me">).
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = e.target as Element | null;
      const anchor = el?.closest?.(
        'a[href*="wa.me"], a[href*="api.whatsapp.com"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const location = anchor.getAttribute("data-wa-location") || "unknown";
      let message = "";
      try {
        message = new URL(href).searchParams.get("text") ?? "";
      } catch {
        /* href relativo/sem query — ignora */
      }
      trackWhatsApp(location, message);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <>
      {gtmId && (
        <>
          <Script id="gtm-base" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="gtm"
            />
          </noscript>
        </>
      )}

      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
