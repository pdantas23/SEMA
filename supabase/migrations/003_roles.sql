-- =============================================================================
-- Migration 003 — Reutilizar profiles_sema (compartilhada) para o blog SEM quebrar
-- o projeto de leads que JÁ ESTÁ EM PRODUÇÃO nesta mesma tabela.
-- Aplicar via SQL Editor do Supabase Studio (após 001 e 002).
-- =============================================================================
--
-- CONTEXTO: profiles_sema já existe e contém usuários do dashboard de leads:
--   role = 'comercial' | 'marketing'  (NÃO devem ser alterados).
-- O blog usa APENAS o papel 'admin'. As políticas RLS das tabelas do blog liberam
-- escrita só para role = 'admin', então 'comercial'/'marketing' continuam restritos
-- ao projeto de leads. Sem conflito.
--
-- Este script é SEGURO e IDEMPOTENTE:
--   • não altera nenhuma linha existente;
--   • só amplia o CHECK constraint de `role` para incluir 'admin';
--   • as linhas atuais ('comercial'/'marketing') continuam válidas no novo CHECK.
-- =============================================================================

BEGIN;

-- 1) Remove o CHECK constraint atual de `role` (preserva os dados).
DO $$
DECLARE
  c record;
BEGIN
  FOR c IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname = 'public'
      AND rel.relname = 'profiles_sema'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%role%'
  LOOP
    EXECUTE format('ALTER TABLE public.profiles_sema DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

-- 2) Recria o CHECK incluindo 'admin' (comercial/marketing seguem válidos).
ALTER TABLE public.profiles_sema
  ADD CONSTRAINT profiles_sema_role_check
  CHECK (role IN ('admin', 'marketing', 'comercial'));

-- 3) Cria o perfil admin do blog (o usuário JÁ existe no Auth, UUID abaixo).
--    Mesma transação: o novo CHECK já está ativo, então 'admin' é aceito.
INSERT INTO public.profiles_sema (id, email, role)
VALUES ('197b0224-89e8-41c8-a5b6-0a79c8c861da', 'semaadmin@royalhub.com.br', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin', email = EXCLUDED.email;

COMMIT;

-- Verificação (rode separadamente): deve mostrar os 2 usuários de leads intactos.
-- SELECT id, email, role FROM public.profiles_sema ORDER BY created_at;

-- =============================================================================
-- USUÁRIO ADMIN DO BLOG
-- =============================================================================
-- O usuário JÁ foi criado no Auth (Authentication > Users):
--   E-mail: semaadmin@royalhub.com.br | Senha: s3m4admin (trocável depois)
--   UUID:   197b0224-89e8-41c8-a5b6-0a79c8c861da
-- O perfil com role 'admin' é inserido pelo passo (3) acima nesta migration.
-- Login do painel após o deploy: /sema/admin/
-- =============================================================================
