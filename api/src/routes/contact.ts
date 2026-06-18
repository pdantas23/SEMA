import { Router } from "express";
import { db } from "../supabase";

export const contactRouter = Router();

/**
 * POST /contact — recebe o formulário do site e grava em leads_sema.
 * Público (sem auth). Entra no CRM já como "Novo".
 */
contactRouter.post("/", async (req, res) => {
  const { nome, email, whatsapp, assunto, mensagem } = req.body ?? {};

  if (!nome || !email || !whatsapp || !mensagem) {
    return res.status(400).json({ ok: false, error: "Campos obrigatórios ausentes." });
  }

  const { error } = await db.from("leads_sema").insert({
    nome: String(nome).slice(0, 200),
    email: String(email).slice(0, 200),
    telefone: String(whatsapp).slice(0, 40),
    necessidade: `[${assunto ?? "Contato"}] ${String(mensagem).slice(0, 4000)}`,
    origem: "site_contato",
    status_comercial: "Novo",
    consentimento_lgpd: true,
  });

  if (error) return res.status(500).json({ ok: false, error: error.message });
  res.json({ ok: true });
});
