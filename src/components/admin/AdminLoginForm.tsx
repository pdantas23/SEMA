"use client";

import { useState } from "react";
import { button } from "@/lib/design/tokens";
import { AdminField, AdminInput } from "@/components/admin/AdminField";

interface AdminLoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ error: string | null }>;
  loading?: boolean;
}

export function AdminLoginForm({ onLogin, loading }: AdminLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await onLogin(email.trim(), password);
    setSubmitting(false);
    if (err) setError(err);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-azul-petroleo font-extrabold text-white text-lg">
            S
          </div>
          <h1 className="text-xl font-bold text-azul-petroleo">Painel SENMA</h1>
          <p className="mt-1 text-sm text-muted">Acesso restrito à equipe</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4"
        >
          <AdminField label="E-mail" required>
            <AdminInput
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              disabled={submitting || loading}
            />
          </AdminField>

          <AdminField label="Senha" required>
            <AdminInput
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting || loading}
            />
          </AdminField>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || loading || !email || !password}
            className={button.primary + " w-full"}
          >
            {submitting ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
