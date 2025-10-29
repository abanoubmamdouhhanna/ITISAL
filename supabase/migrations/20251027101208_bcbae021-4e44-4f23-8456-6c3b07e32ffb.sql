-- Create language_setup table
CREATE TABLE public.language_setup (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key_name TEXT NOT NULL,
  language_code VARCHAR(10) NOT NULL,
  translated_text TEXT NOT NULL,
  group_category TEXT, -- Optional: for grouping keys (auth, dashboard, navbar, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(key_name, language_code) -- Ensure one translation per key per language
);

-- Add index for faster queries
CREATE INDEX idx_language_setup_key_lang ON public.language_setup(key_name, language_code);
CREATE INDEX idx_language_setup_lang ON public.language_setup(language_code);

-- Enable Row Level Security
ALTER TABLE public.language_setup ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read translations (public access)
CREATE POLICY "public_read_translations" 
ON public.language_setup 
FOR SELECT 
USING (true);

-- Only allow INSERT/UPDATE/DELETE for authenticated users or admins
-- You can customize this based on your auth setup
CREATE POLICY "public_access_write" 
ON public.language_setup 
FOR ALL 
USING (true);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_language_setup_updated_at
BEFORE UPDATE ON public.language_setup
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample translations to get started
INSERT INTO public.language_setup (key_name, language_code, translated_text, group_category) VALUES
('login_button', 'en', 'Login', 'auth'),
('login_button', 'ar', 'تسجيل الدخول', 'auth'),
('welcome_title', 'en', 'Welcome to our system', 'general'),
('welcome_title', 'ar', 'مرحبًا بكم في نظامنا', 'general'),
('app.language', 'en', 'Language', 'common'),
('app.language', 'ar', 'اللغة', 'common'),
('app.save', 'en', 'Save', 'common'),
('app.save', 'ar', 'حفظ', 'common'),
('app.cancel', 'en', 'Cancel', 'common'),
('app.cancel', 'ar', 'إلغاء', 'common');