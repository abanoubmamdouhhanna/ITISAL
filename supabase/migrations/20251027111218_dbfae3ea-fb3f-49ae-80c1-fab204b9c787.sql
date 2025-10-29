-- Drop old table
DROP TABLE IF EXISTS public.language_setup CASCADE;

-- Create languages table
CREATE TABLE public.languages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL,
  name text NOT NULL,
  native_name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  is_rtl boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT languages_pkey PRIMARY KEY (id),
  CONSTRAINT languages_code_key UNIQUE (code)
);

-- Create translations table
CREATE TABLE public.translations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  key text NOT NULL,
  language_code text NOT NULL,
  value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT translations_pkey PRIMARY KEY (id),
  CONSTRAINT translations_key_language_code_key UNIQUE (key, language_code),
  CONSTRAINT translations_language_code_fkey FOREIGN KEY (language_code) REFERENCES languages (code) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for languages
CREATE POLICY "Everyone can view languages"
ON public.languages
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage languages"
ON public.languages
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for translations
CREATE POLICY "Everyone can view translations"
ON public.translations
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage translations"
ON public.translations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers
CREATE TRIGGER update_languages_updated_at
BEFORE UPDATE ON public.languages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_translations_updated_at
BEFORE UPDATE ON public.translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();