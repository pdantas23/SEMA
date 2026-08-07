"use client";

import { useState, useEffect, useCallback } from "react";
import { API_URL, apiAuth, getSession, setSession } from "@/lib/api/client";
import type { AdminRole } from "@/lib/types";

export interface AdminUser {
  id: string;
  email?: string;
}

export interface AdminAuthState {
  user: AdminUser | null;
  role: AdminRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  hasAccess: boolean;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: AdminUser;
  role: AdminRole;
}

/**
 * Autenticação do admin via API (api.senma.adv.br).
 * O browser não fala mais com o Supabase: login/refresh/validação passam pela
 * API, que confere o papel 'admin' em profiles_sema.
 */
export function useAdminAuth(): AdminAuthState {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaura a sessão a partir do token salvo (valida em /auth/me).
  useEffect(() => {
    let mounted = true;
    async function restore() {
      if (!getSession()) {
        if (mounted) setLoading(false);
        return;
      }
      try {
        const me = await apiAuth.get<{ user: AdminUser; role: AdminRole }>("/auth/me");
        if (!mounted) return;
        setUser(me.user);
        setRole(me.role);
      } catch {
        setSession(null);
        if (mounted) {
          setUser(null);
          setRole(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    restore();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!API_URL) return { error: "API não configurada (NEXT_PUBLIC_API_URL)." };
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as Partial<LoginResponse> & { error?: string };
      if (!res.ok || !data.access_token) {
        return { error: data.error ?? "Falha no login." };
      }
      setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token!,
        expires_at: data.expires_at,
      });
      setUser(data.user ?? null);
      setRole((data.role as AdminRole) ?? null);
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  }, []);

  const logout = useCallback(async () => {
    setSession(null);
    setUser(null);
    setRole(null);
  }, []);

  // Acesso ao painel é EXCLUSIVO de 'admin' (a API também valida).
  const hasAccess = Boolean(user && role === "admin");

  return { user, role, loading, login, logout, hasAccess };
}
