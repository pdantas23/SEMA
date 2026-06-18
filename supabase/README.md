# Supabase — SEMA_BLOG

Instruções para aplicar as migrations e rodar o seed inicial.

---

## Pré-requisitos

- Acesso ao SQL Editor do Supabase Studio (tenant compartilhado)
- `.env.local` com as variáveis abaixo configuradas:

```
NEXT_PUBLIC_SUPABASE_URL=https://<seu-projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<chave-anon>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

---

## Passo 1 — Aplicar migrations no SQL Editor

Abra o Supabase Studio > SQL Editor e execute **na ordem**:

### 001 — Schema do blog

Cole o conteúdo de `supabase/migrations/001_blog_schema.sql` e execute.

Cria as tabelas `categories_sema`, `posts_sema`, `news_sema`, `events_sema`,
`areas_sema`, `team_sema` e `instagram_sema`, com RLS, índices e trigger
`updated_at` em `posts_sema`.

### 002 — Storage

Cole o conteúdo de `supabase/migrations/002_storage.sql` e execute.

Cria o bucket público `sema-media` e as policies de leitura pública /
escrita restrita a staff (apenas `admin`).

### 003 — Roles

Cole o conteúdo de `supabase/migrations/003_roles.sql` e execute.

Verifica/ajusta a coluna `role` de `profiles_sema` para aceitar os papéis
`admin`, `marketing`, `comercial`. Leia os comentários do arquivo
antes de executar — há blocos condicionais que dependem da estrutura atual
da tabela.

---

## Passo 2 — Rodar o seed

Com as migrations aplicadas e o `.env.local` configurado:

```bash
npm run seed
# ou diretamente:
npx tsx scripts/seed.ts
```

O seed é **idempotente**: pode ser executado mais de uma vez sem duplicar
registros (usa upsert por slug ou por name em team_sema).

O que é inserido:

| Tabela | Registros |
|---|---|
| `categories_sema` | 4 categorias (Tributário, Trabalhista, Empresarial, Geral) |
| `posts_sema` | 3 posts publicados (1 featured) |
| `news_sema` | 2 notícias publicadas |
| `events_sema` | 1 evento publicado |
| `areas_sema` | 5 áreas de atuação |
| `team_sema` | 3 sócios placeholder |
| `instagram_sema` | 2 posts de exemplo |

---

## Passo 3 — Publicar conteúdo novo

O site é gerado estaticamente (`next build`). Ao publicar ou atualizar
conteúdo no painel admin, é necessário disparar um novo build para que as
páginas reflitam as alterações:

```bash
npm run build
```

Se o projeto estiver em CI/CD (Vercel, Netlify etc.), dispare o deploy
manualmente ou configure um webhook de rebuild via Supabase Database Webhooks
apontando para o endpoint de revalidação do Next.js.

---

## Promover usuário a admin

No SQL Editor do Supabase Studio:

```sql
UPDATE public.profiles_sema
SET role = 'admin'
WHERE id = '<UUID-do-usuario>';
```

Substitua `<UUID-do-usuario>` pelo UUID do usuário em `auth.users`.

Para consultar os usuários com acesso staff:

```sql
SELECT id, role FROM public.profiles_sema
WHERE role = 'admin'
ORDER BY role;
```
