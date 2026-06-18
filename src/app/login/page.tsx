"use client";

/**
 * Atalho /login — redireciona para /admin, onde o gate de autenticação
 * (AdminLayout) renderiza o formulário de login ou o painel.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginShortcutPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-sm text-muted">Redirecionando para o painel…</div>
    </div>
  );
}
