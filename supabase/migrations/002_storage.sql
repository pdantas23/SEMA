-- =============================================================================
-- Migration 002 — Storage bucket sema-media
-- Bucket público para imagens do blog, notícias e eventos.
-- Aplicar via SQL Editor do Supabase Studio (após 001_blog_schema.sql).
-- Para Supabase self-hosted: insere diretamente nas tabelas internas de storage.
-- =============================================================================

-- Cria o bucket público sema-media (idempotente via ON CONFLICT)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'sema-media',
  'sema-media',
  true,                        -- acesso público de leitura
  10485760,                    -- limite: 10 MB por arquivo
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ]
)
ON CONFLICT (id) DO NOTHING;


-- ---------------------------------------------------------------------------
-- Policies em storage.objects
-- ---------------------------------------------------------------------------

-- Leitura pública — qualquer visitante pode ler arquivos do bucket sema-media
CREATE POLICY "sema-media: public read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'sema-media');

-- Upload (INSERT) apenas para staff autenticado (apenas admin)
CREATE POLICY "sema-media: staff insert"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'sema-media'
    AND auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  );

-- Atualização (UPDATE) apenas para staff autenticado
CREATE POLICY "sema-media: staff update"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'sema-media'
    AND auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  );

-- Exclusão (DELETE) apenas para staff autenticado
CREATE POLICY "sema-media: staff delete"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'sema-media'
    AND auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  );
