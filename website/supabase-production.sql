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
-- VERIFICATION QUERIES
-- ============================================
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'projects';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'reviews';
-- SELECT * FROM pg_policies WHERE tablename IN ('projects', 'reviews');
-- SELECT * FROM storage.buckets WHERE id = 'project-images';
