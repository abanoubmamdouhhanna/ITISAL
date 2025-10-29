-- Insert default languages if they don't exist
INSERT INTO public.languages (code, name, native_name, is_rtl, is_active) VALUES
  ('en', 'English', 'English', false, true),
  ('ar', 'Arabic', 'العربية', true, true)
ON CONFLICT (code) DO NOTHING;