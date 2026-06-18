-- =============================================================================
-- Migration 001 — Blog Schema SEMA
-- Tabelas com sufixo _sema para Supabase compartilhado.
-- NÃO recria leads_sema nem profiles_sema (já existentes no tenant).
-- Aplicar via SQL Editor do Supabase Studio.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- categories_sema
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories_sema (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL    DEFAULT now(),
  name        text        NOT NULL,
  slug        text        NOT NULL,
  description text
);

CREATE UNIQUE INDEX IF NOT EXISTS categories_sema_slug_idx ON public.categories_sema (slug);

ALTER TABLE public.categories_sema ENABLE ROW LEVEL SECURITY;

-- SELECT público total (categorias são metadados sem conteúdo sensível)
CREATE POLICY "categories_sema: public select"
  ON public.categories_sema
  FOR SELECT
  USING (true);

-- INSERT/UPDATE/DELETE apenas para apenas admin
CREATE POLICY "categories_sema: staff write"
  ON public.categories_sema
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  );


-- ---------------------------------------------------------------------------
-- posts_sema
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts_sema (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL    DEFAULT now(),
  updated_at      timestamptz,
  title           text        NOT NULL,
  subtitle        text,
  slug            text        NOT NULL,
  excerpt         text,
  content         text        NOT NULL DEFAULT '',
  cover_image     text,
  cover_alt       text,
  category_id     uuid        REFERENCES public.categories_sema (id) ON DELETE SET NULL,
  author          text,
  tags            text[],
  instagram_url   text,
  published       boolean     NOT NULL DEFAULT false,
  featured        boolean     NOT NULL DEFAULT false,
  published_at    timestamptz,
  seo_title       text,
  seo_description text,
  seo_keyword     text
);

CREATE UNIQUE INDEX IF NOT EXISTS posts_sema_slug_idx        ON public.posts_sema (slug);
CREATE        INDEX IF NOT EXISTS posts_sema_published_idx   ON public.posts_sema (published);
CREATE        INDEX IF NOT EXISTS posts_sema_category_idx    ON public.posts_sema (category_id);
CREATE        INDEX IF NOT EXISTS posts_sema_featured_idx    ON public.posts_sema (featured) WHERE featured = true;

ALTER TABLE public.posts_sema ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_sema: public select published"
  ON public.posts_sema
  FOR SELECT
  USING (published = true);

CREATE POLICY "posts_sema: staff write"
  ON public.posts_sema
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  );

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS posts_sema_updated_at ON public.posts_sema;
CREATE TRIGGER posts_sema_updated_at
  BEFORE UPDATE ON public.posts_sema
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ---------------------------------------------------------------------------
-- news_sema
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.news_sema (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL    DEFAULT now(),
  title           text        NOT NULL,
  slug            text        NOT NULL,
  content         text        NOT NULL DEFAULT '',
  cover_image     text,
  cover_alt       text,
  gallery         text[],
  category_id     uuid        REFERENCES public.categories_sema (id) ON DELETE SET NULL,
  location        text,
  published       boolean     NOT NULL DEFAULT false,
  featured        boolean     NOT NULL DEFAULT false,
  published_at    timestamptz,
  seo_title       text,
  seo_description text,
  seo_keyword     text
);

CREATE UNIQUE INDEX IF NOT EXISTS news_sema_slug_idx       ON public.news_sema (slug);
CREATE        INDEX IF NOT EXISTS news_sema_published_idx  ON public.news_sema (published);

ALTER TABLE public.news_sema ENABLE ROW LEVEL SECURITY;

CREATE POLICY "news_sema: public select published"
  ON public.news_sema
  FOR SELECT
  USING (published = true);

CREATE POLICY "news_sema: staff write"
  ON public.news_sema
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  );


-- ---------------------------------------------------------------------------
-- events_sema
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events_sema (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL    DEFAULT now(),
  name            text        NOT NULL,
  slug            text        NOT NULL,
  description     text        NOT NULL DEFAULT '',
  cover_image     text,
  cover_alt       text,
  gallery         text[],
  event_date      timestamptz,
  location        text,
  participants    text,
  theme           text,
  related_link    text,
  instagram_url   text,
  published       boolean     NOT NULL DEFAULT false,
  featured        boolean     NOT NULL DEFAULT false,
  seo_title       text,
  seo_description text,
  seo_keyword     text
);

CREATE UNIQUE INDEX IF NOT EXISTS events_sema_slug_idx      ON public.events_sema (slug);
CREATE        INDEX IF NOT EXISTS events_sema_published_idx ON public.events_sema (published);

ALTER TABLE public.events_sema ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_sema: public select published"
  ON public.events_sema
  FOR SELECT
  USING (published = true);

CREATE POLICY "events_sema: staff write"
  ON public.events_sema
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  );


-- ---------------------------------------------------------------------------
-- areas_sema
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.areas_sema (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL    DEFAULT now(),
  title       text        NOT NULL,
  slug        text        NOT NULL,
  summary     text        NOT NULL DEFAULT '',
  description text,
  icon        text,
  "order"     integer     NOT NULL DEFAULT 0,
  published   boolean     NOT NULL DEFAULT true
);

CREATE UNIQUE INDEX IF NOT EXISTS areas_sema_slug_idx      ON public.areas_sema (slug);
CREATE        INDEX IF NOT EXISTS areas_sema_published_idx ON public.areas_sema (published);

ALTER TABLE public.areas_sema ENABLE ROW LEVEL SECURITY;

CREATE POLICY "areas_sema: public select published"
  ON public.areas_sema
  FOR SELECT
  USING (published = true);

CREATE POLICY "areas_sema: staff write"
  ON public.areas_sema
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  );


-- ---------------------------------------------------------------------------
-- team_sema
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.team_sema (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL    DEFAULT now(),
  name        text        NOT NULL,
  role        text,
  bio         text,
  photo       text,
  specialties text[],
  "order"     integer     NOT NULL DEFAULT 0,
  published   boolean     NOT NULL DEFAULT true
);

CREATE        INDEX IF NOT EXISTS team_sema_published_idx ON public.team_sema (published);

ALTER TABLE public.team_sema ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_sema: public select published"
  ON public.team_sema
  FOR SELECT
  USING (published = true);

CREATE POLICY "team_sema: staff write"
  ON public.team_sema
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  );


-- ---------------------------------------------------------------------------
-- instagram_sema
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.instagram_sema (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   timestamptz NOT NULL    DEFAULT now(),
  url          text        NOT NULL,
  caption      text,
  category_id  uuid        REFERENCES public.categories_sema (id) ON DELETE SET NULL,
  related_type text        CHECK (related_type IN ('post', 'news', 'event')),
  related_id   uuid
);

CREATE        INDEX IF NOT EXISTS instagram_sema_created_idx ON public.instagram_sema (created_at DESC);

ALTER TABLE public.instagram_sema ENABLE ROW LEVEL SECURITY;

-- SELECT público total (vitrine de Instagram)
CREATE POLICY "instagram_sema: public select"
  ON public.instagram_sema
  FOR SELECT
  USING (true);

CREATE POLICY "instagram_sema: staff write"
  ON public.instagram_sema
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles_sema WHERE role = 'admin'
    )
  );
