-- Create hero_stats table
CREATE TABLE hero_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  position int NOT NULL UNIQUE CHECK (position BETWEEN 1 AND 3),
  value text NOT NULL,
  label text NOT NULL,
  prefix text,
  updated_at timestamptz DEFAULT now()
);

-- Seed with current hardcoded values
INSERT INTO hero_stats (position, value, label, prefix) VALUES
(1, '150+', 'Obras Entregues', null),
(2, '40%', 'de Economia Garantida', 'Até '),
(3, '9', 'Anos de Mercado', null);

-- Enable RLS
ALTER TABLE hero_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON hero_stats FOR SELECT USING (true);
CREATE POLICY "Auth write" ON hero_stats FOR ALL USING (auth.role() = 'authenticated');
