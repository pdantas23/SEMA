import type { Request, Response, NextFunction } from "express";
import { db } from "./supabase";

export interface AuthedRequest extends Request {
  userId?: string;
  userEmail?: string;
  role?: string;
}

/** Extrai o Bearer token do header Authorization. */
function bearer(req: Request): string | null {
  const h = req.headers.authorization ?? "";
  return h.startsWith("Bearer ") ? h.slice(7) : null;
}

/**
 * Middleware: exige um JWT válido do Supabase cujo usuário tenha role 'admin'
 * em profiles_sema. Sem isso, 401/403. Toda rota /admin passa por aqui.
 */
export async function requireAdmin(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const token = bearer(req);
  if (!token) return res.status(401).json({ error: "Não autenticado." });

  const { data: userData, error } = await db.auth.getUser(token);
  if (error || !userData?.user) {
    return res.status(401).json({ error: "Sessão inválida ou expirada." });
  }

  const { data: profile } = await db
    .from("profiles_sema")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return res.status(403).json({ error: "Acesso restrito ao administrador." });
  }

  req.userId = userData.user.id;
  req.userEmail = userData.user.email ?? undefined;
  req.role = profile.role;
  next();
}
