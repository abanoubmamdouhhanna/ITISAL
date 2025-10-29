-- Create brands table for brand management
CREATE TABLE public.brands (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_eng_name text NOT NULL,
  brand_ar_name text NOT NULL,
  brand_image text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "public_access" 
ON public.brands 
FOR ALL 
USING (true);

-- Add index for better performance
CREATE INDEX idx_brands_eng_name ON public.brands(brand_eng_name);
CREATE INDEX idx_brands_ar_name ON public.brands(brand_ar_name);

-- Add brand_id to store_setup table to link stores to brands
ALTER TABLE public.store_setup 
ADD COLUMN brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL;

-- Remove the previous brand name columns since we now have a separate brands table
ALTER TABLE public.store_setup 
DROP COLUMN IF EXISTS brand_eng_name,
DROP COLUMN IF EXISTS brand_ar_name;