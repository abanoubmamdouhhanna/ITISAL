-- Create languages table for managing available languages
CREATE TABLE IF NOT EXISTS public.languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  is_rtl BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "public_access" ON public.languages FOR ALL USING (true);

-- Insert default languages
INSERT INTO public.languages (code, name, native_name, is_rtl, is_active) VALUES
  ('en', 'English', 'English', false, true),
  ('ar', 'Arabic', 'العربية', true, true)
ON CONFLICT (code) DO NOTHING;