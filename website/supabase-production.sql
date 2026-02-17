-- ============================================
-- PLENUS — PRODUCTION SCHEMA
-- ============================================
-- Single source of truth. Run on a fresh Supabase project:
--   Dashboard → SQL Editor → New Query → paste & run.
-- No seed data — projects and reviews are created via the
-- admin dashboard and public review form respectively.

-- ============================================
-- 1. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  area TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  description TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.projects IS 'Projects for the Plenus construction company portfolio';

-- ============================================
-- 2. REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  location TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.reviews IS 'Customer reviews for Plenus construction company';

-- ============================================
-- 3. UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. INDEXES
-- ============================================
CREATE INDEX idx_projects_published_created
  ON public.projects (published, created_at DESC);

CREATE INDEX idx_reviews_approved_created
  ON public.reviews (approved, created_at DESC);

-- ============================================
-- 5. ROW LEVEL SECURITY — PROJECTS
-- ============================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published projects"
  ON public.projects
  FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can read all projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 6. ROW LEVEL SECURITY — REVIEWS
-- ============================================
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved reviews"
  ON public.reviews
  FOR SELECT
  USING (approved = true);

CREATE POLICY "Anyone can insert reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete reviews"
  ON public.reviews
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 7. STORAGE BUCKET FOR IMAGES
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. STORAGE POLICIES
-- ============================================
CREATE POLICY "Anyone can read project images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can update project images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can delete project images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');

-- ============================================
-- 9. ADMIN USER
-- ============================================
-- Create your admin user through Supabase Dashboard:
-- 1. Go to Authentication → Users
-- 2. Click "Add user" → "Create new user"
-- 3. Enter email and password
-- 4. Click "Create user"

-- ============================================
-- 10. LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type TEXT NOT NULL CHECK (form_type IN ('contact','pos-venda','trabalhe-conosco','financiamento')),
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo','em_negociacao','fechado')),
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  -- Contact-specific
  tipo_projeto TEXT,
  mensagem TEXT,
  -- Pós-venda-specific
  assunto TEXT,
  descricao TEXT,
  -- Trabalhe Conosco-specific
  area_interesse TEXT,
  sobre_voce TEXT,
  -- Financiamento-specific
  cpf TEXT,
  endereco TEXT,
  data_nascimento TEXT,
  observacao TEXT,
  -- Admin
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.leads IS 'Leads captured from website forms';

-- ============================================
-- 11. LEADS TRIGGER
-- ============================================
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 12. LEADS INDEXES
-- ============================================
CREATE INDEX idx_leads_status_formtype_created
  ON public.leads (status, form_type, created_at DESC);

-- ============================================
-- 13. ROW LEVEL SECURITY — LEADS
-- ============================================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update leads"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete leads"
  ON public.leads
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 14. PROJECT EVENTS TABLE (click tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS public.project_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('modal_open','cta_click')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.project_events IS 'Tracks user interactions with projects (modal opens, CTA clicks)';

-- ============================================
-- 15. PROJECT EVENTS INDEXES
-- ============================================
CREATE INDEX idx_project_events_project_type_created
  ON public.project_events (project_id, event_type, created_at DESC);

-- ============================================
-- 16. ROW LEVEL SECURITY — PROJECT EVENTS
-- ============================================
ALTER TABLE public.project_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert project events"
  ON public.project_events
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read project events"
  ON public.project_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete project events"
  ON public.project_events
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 17. FINANCING SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.financing_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.financing_settings IS 'Key-value settings for the financing simulator (e.g. interest rate)';

CREATE TRIGGER update_financing_settings_updated_at
  BEFORE UPDATE ON public.financing_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 18. ROW LEVEL SECURITY — FINANCING SETTINGS
-- ============================================
ALTER TABLE public.financing_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read financing settings"
  ON public.financing_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert financing settings"
  ON public.financing_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update financing settings"
  ON public.financing_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed default interest rate
INSERT INTO public.financing_settings (key, value)
VALUES ('interest_rate', '{"annual_rate": 10.49, "description": "Taxa de juros anual padrão"}')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'projects';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'reviews';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'leads';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'project_events';
-- SELECT * FROM pg_policies WHERE tablename IN ('projects', 'reviews', 'leads', 'project_events');
-- SELECT * FROM storage.buckets WHERE id = 'project-images';
