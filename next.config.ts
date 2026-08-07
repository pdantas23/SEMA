import type { NextConfig } from "next";

/**
 * SITE ESTÁTICO (Hostinger) — output export.
 * O domínio agora é raiz (senma.adv.br), então NÃO há basePath.
 * Todo dado vem da API (api.senma.adv.br) via NEXT_PUBLIC_API_URL.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true }, // obrigatório no export
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
