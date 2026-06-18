import Link from "next/link";
import Image from "next/image";
import { assetPath, cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { button, typography } from "@/lib/design/tokens";

export const metadata = {
  title: "Página não encontrada",
  description: "A página que você procura não existe ou foi movida.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-branco-gelo px-5 py-16 text-center">
      <Link href="/" className="mb-10 inline-block">
        <Image
          src={assetPath("/logo-sema.png")}
          alt={SITE.name}
          width={150}
          height={44}
          className="h-11 w-auto object-contain"
          priority
        />
      </Link>

      <p className={cn(typography.eyebrow, "mb-3")}>Erro 404</p>
      <h1 className={cn(typography.h1, "mb-4")}>Página não encontrada</h1>
      <p className="mb-9 max-w-md text-base leading-relaxed text-azul-petroleo/70">
        A página que você procura não existe, foi movida ou o endereço está
        incorreto. Verifique o link ou volte ao início.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/" className={button.primary}>
          Voltar para a página inicial
        </Link>
        <Link href="/contato" className={button.secondary}>
          Falar com o escritório
        </Link>
      </div>

      <nav aria-label="Atalhos" className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <Link href="/blog" className="text-azul-lavanda transition-colors hover:text-azul-petroleo">
          Blog
        </Link>
        <Link href="/noticias" className="text-azul-lavanda transition-colors hover:text-azul-petroleo">
          Notícias
        </Link>
        <Link href="/eventos" className="text-azul-lavanda transition-colors hover:text-azul-petroleo">
          Eventos
        </Link>
      </nav>
    </main>
  );
}
