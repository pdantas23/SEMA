-- =============================================================================
-- Migration 004 — Acesso do papel 'admin' (painel do blog/CRM) à leads_sema.
-- Aplicar via SQL Editor do Supabase Studio (após 001–003).
-- =============================================================================
--
-- CONTEXTO: leads_sema é COMPARTILHADA e já está em produção (projeto de leads,
-- papéis 'comercial'/'marketing'). O CRM deste painel usa o papel 'admin'.
--
-- Este script é ADITIVO, SEGURO e IDEMPOTENTE:
--   • NÃO recria a tabela e NÃO altera nenhuma linha (dados antigos preservados);
--   • apenas ADICIONA políticas para role = 'admin'. Políticas RLS combinam com
--     OR, então o acesso atual de 'comercial'/'marketing' continua intacto.
--   • o INSERT público do formulário do site (origem 'site_contato') não é
--     alterado por este script.
--
-- Mesmo padrão usado nas tabelas do blog (migration 001):
--   auth.uid() IN (SELECT id FROM profiles_sema WHERE role = 'admin')
-- =============================================================================

BEGIN;

ALTER TABLE public.leads_sema ENABLE ROW LEVEL SECURITY;

-- SELECT
DROP POLICY IF EXISTS "leads_sema: admin select" ON public.leads_sema;
CREATE POLICY "leads_sema: admin select"
  ON public.leads_sema
  FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.profiles_sema WHERE role = 'admin')
  );

-- UPDATE
DROP POLICY IF EXISTS "leads_sema: admin update" ON public.leads_sema;
CREATE POLICY "leads_sema: admin update"
  ON public.leads_sema
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM public.profiles_sema WHERE role = 'admin')
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM public.profiles_sema WHERE role = 'admin')
  );

-- DELETE
DROP POLICY IF EXISTS "leads_sema: admin delete" ON public.leads_sema;
CREATE POLICY "leads_sema: admin delete"
  ON public.leads_sema
  FOR DELETE
  USING (
    auth.uid() IN (SELECT id FROM public.profiles_sema WHERE role = 'admin')
  );

COMMIT;
