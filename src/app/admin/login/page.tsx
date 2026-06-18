"use client";

/**
 * Rota /admin/login — redireciona para /admin (o layout já cuida do gate de autenticação).
 * Esta página existe apenas como ponto de entrada alternativo.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminLoginPage() {
  const { user, hasAccess, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && hasAccess) {
      router.replace("/admin");
    }
  }, [loading, user, hasAccess, router]);

  // Layout parent handles the login form rendering
  return null;
}
