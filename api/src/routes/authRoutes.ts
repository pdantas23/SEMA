import { Router } from "express";
import { authClient, db } from "../supabase";
import { requireAdmin, type AuthedRequest } from "../auth";

export const authRouter = Router();

async function roleOf(userId: string): Promise<string | null> {
  const { data } = await db
    .from("profiles_sema")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return (data?.role as string) ?? null;
}

/** POST /auth/login — autentica e devolve a sessão + role. */
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "Informe e-mail e senha." });
  }

  const { data, error } = await authClient.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    return res.status(401).json({ error: "Credenciais inválidas." });
  }

  const role = await roleOf(data.user.id);
  if (role !== "admin") {
    return res.status(403).json({ error: "Conta sem permissão de administrador." });
  }

  res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    user: { id: data.user.id, email: data.user.email },
    role,
  });
});

/** POST /auth/refresh — renova a sessão a partir do refresh_token. */
authRouter.post("/refresh", async (req, res) => {
  const { refresh_token } = req.body ?? {};
  if (!refresh_token) return res.status(400).json({ error: "refresh_token ausente." });

  const { data, error } = await authClient.auth.refreshSession({ refresh_token });
  if (error || !data.session) {
    return res.status(401).json({ error: "Sessão expirada." });
  }
  res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
  });
});

/** GET /auth/me — valida o token e devolve usuário + role. */
authRouter.get("/me", requireAdmin, (req: AuthedRequest, res) => {
  res.json({ user: { id: req.userId, email: req.userEmail }, role: req.role });
});
