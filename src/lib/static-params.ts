/**
 * Slugs pré-renderizados no build + o shell de fallback.
 *
 * Cada slug vindo da API vira uma pasta real no export (out/blog/<slug>/), com
 * <head> próprio — é o que o robô do WhatsApp/Facebook lê ao compartilhar.
 *
 * O shell "_" continua existindo: conteúdo publicado DEPOIS do último build não
 * tem pasta, então o rewrite do .htaccess entrega o shell e o client resolve o
 * slug pela URL. A página funciona na hora; o card do compartilhamento só fica
 * específico após o próximo deploy.
 */
export const SHELL_SLUG = "_";

export function staticParamsWithShell(slugs: string[], label: string) {
  if (slugs.length === 0) {
    console.warn(
      `[build] Nenhum slug de "${label}" retornado pela API — só o shell "${SHELL_SLUG}" será gerado. ` +
        `Verifique NEXT_PUBLIC_API_URL e se a API está no ar; sem isso, os cards de compartilhamento ` +
        `ficam todos institucionais.`
    );
  } else {
    console.log(`[build] ${label}: ${slugs.length} página(s) pré-renderizada(s) para compartilhamento.`);
  }

  const unique = Array.from(new Set(slugs.filter(Boolean)));
  return [{ slug: SHELL_SLUG }, ...unique.map((slug) => ({ slug }))];
}
