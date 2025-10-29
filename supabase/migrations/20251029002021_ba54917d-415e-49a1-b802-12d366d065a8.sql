-- Add brand name fields to store_setup table
ALTER TABLE public.store_setup 
ADD COLUMN brand_eng_name text,
ADD COLUMN brand_ar_name text;

-- Add index for better performance when filtering by brand
CREATE INDEX idx_store_setup_brand_eng_name ON public.store_setup(brand_eng_name);
CREATE INDEX idx_store_setup_brand_ar_name ON public.store_setup(brand_ar_name);