-- ============================================
-- PLENUS ADMIN DASHBOARD - SUPABASE SETUP
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query

-- ============================================
-- 1. CREATE PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  area TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment to table
COMMENT ON TABLE public.projects IS 'Projects for the Plenus construction company portfolio';

-- ============================================
-- 2. CREATE UPDATED_AT TRIGGER
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

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on the projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published projects
CREATE POLICY "Anyone can read published projects"
  ON public.projects
  FOR SELECT
  USING (published = true);

-- Policy: Authenticated users can read all projects
CREATE POLICY "Authenticated users can read all projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert projects
CREATE POLICY "Authenticated users can insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update projects
CREATE POLICY "Authenticated users can update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete projects
CREATE POLICY "Authenticated users can delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 4. CREATE STORAGE BUCKET FOR IMAGES
-- ============================================
-- Create the bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. STORAGE POLICIES
-- ============================================
-- Policy: Anyone can read images (public bucket)
CREATE POLICY "Anyone can read project images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'project-images');

-- Policy: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload project images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

-- Policy: Authenticated users can update images
CREATE POLICY "Authenticated users can update project images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images');

-- Policy: Authenticated users can delete images
CREATE POLICY "Authenticated users can delete project images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');

-- ============================================
-- 6. SEED DATA (MIGRATE EXISTING PROJECTS)
-- ============================================
-- This migrates the 6 existing hardcoded projects to the database
-- Note: You'll need to re-upload images to Supabase Storage
-- or update image_url to use the local public paths

INSERT INTO public.projects (title, location, area, category, image_url, description, published)
VALUES
  (
    'Residência Moderna',
    'Indaiatuba, SP',
    '250m²',
    'Casa Térrea',
    '/projects/project-1.png',
    'Projeto contemporâneo com linhas retas e integração total entre os ambientes. A residência conta com amplas áreas de convivência, iluminação natural abundante e acabamentos de alto padrão.',
    true
  ),
  (
    'Casa Contemporânea',
    'Jundiaí, SP',
    '320m²',
    'Sobrado',
    '/projects/project-2.png',
    'Sobrado elegante com design arrojado, combinando materiais nobres como madeira e vidro. Os dois pavimentos foram projetados para maximizar o conforto e a privacidade da família.',
    true
  ),
  (
    'Projeto Personalizado',
    'Indaiatuba, SP',
    '280m²',
    'Casa Térrea',
    '/projects/project-3.png',
    'Residência desenvolvida sob medida para atender às necessidades específicas dos moradores. Cada ambiente foi pensado para proporcionar funcionalidade e bem-estar.',
    true
  ),
  (
    'Residência Premium',
    'Jundiaí, SP',
    '400m²',
    'Sobrado',
    '/projects/project-4.png',
    'Imponente sobrado com acabamentos premium e arquitetura sofisticada. A residência oferece amplos espaços de lazer, suítes confortáveis e áreas gourmet completas.',
    true
  ),
  (
    'Casa Elegante',
    'Indaiatuba, SP',
    '220m²',
    'Casa Térrea',
    '/projects/project-5.png',
    'Casa térrea com design elegante e atemporal. O projeto prioriza a conexão com áreas externas e jardins, criando um ambiente de paz e tranquilidade.',
    true
  ),
  (
    'Projeto Exclusivo',
    'Jundiaí, SP',
    '350m²',
    'Sobrado',
    '/projects/project-6.png',
    'Projeto exclusivo com arquitetura única e personalizada. Cada detalhe foi cuidadosamente planejado para criar uma residência que reflete o estilo de vida dos moradores.',
    true
  );

-- ============================================
-- 7. CREATE REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  location TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment to table
COMMENT ON TABLE public.reviews IS 'Customer reviews for Plenus construction company';

-- Enable RLS on the reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved reviews
CREATE POLICY "Anyone can read approved reviews"
  ON public.reviews
  FOR SELECT
  USING (approved = true);

-- Policy: Anyone can insert reviews (for submitting new reviews)
CREATE POLICY "Anyone can insert reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (true);

-- Policy: Authenticated users can read all reviews
CREATE POLICY "Authenticated users can read all reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can update reviews
CREATE POLICY "Authenticated users can update reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete reviews
CREATE POLICY "Authenticated users can delete reviews"
  ON public.reviews
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 8. CREATE ADMIN USER
-- ============================================
-- IMPORTANT: Create your admin user through Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add user" > "Create new user"
-- 3. Enter email and password
-- 4. Click "Create user"
--
-- Alternatively, you can use the Supabase Auth API or
-- sign up through your login page (but disable public signups after)

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the setup worked:

-- Check projects table exists and has data
-- SELECT * FROM public.projects;

-- Check RLS policies
-- SELECT * FROM pg_policies WHERE tablename = 'projects';

-- Check storage bucket exists
-- SELECT * FROM storage.buckets WHERE id = 'project-images';
