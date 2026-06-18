"use client";

import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading, login, logout, hasAccess } = useAdminAuth();
  const pathname = usePathname();

  // Allow login page to render without guard
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/login/";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted">Carregando…</div>
      </div>
    );
  }

  if (!user && !isLoginPage) {
    return <AdminLoginForm onLogin={login} />;
  }

  if (user && !hasAccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-azul-petroleo">Acesso negado</h1>
          <p className="mt-2 text-sm text-muted">
            Sua conta não possui permissão para acessar o painel administrativo.
          </p>
          <p className="mt-1 text-xs text-muted">
            Entre em contato com o administrador do sistema.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-border px-4 py-2 text-sm text-azul-petroleo hover:bg-azul-claro/10 transition-colors"
        >
          Sair
        </button>
      </div>
    );
  }

  if (!user && isLoginPage) {
    return <AdminLoginForm onLogin={login} />;
  }

  return (
    <AdminShell role={role} userEmail={user?.email} onLogout={logout}>
      {children}
    </AdminShell>
  );
}
