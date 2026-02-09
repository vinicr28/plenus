-- ============================================
-- PLENUS REVIEWS TABLE SETUP
-- ============================================
-- Run this SQL in your Supabase SQL Editor

-- Create reviews table
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
