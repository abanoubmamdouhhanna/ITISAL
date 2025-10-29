-- Drop all existing policies on each table
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- Create new permissive policies allowing all operations
CREATE POLICY "public_access" ON public.store_setup FOR ALL USING (true);
CREATE POLICY "public_access" ON public.region_setup FOR ALL USING (true);
CREATE POLICY "public_access" ON public.store_region_links FOR ALL USING (true);
CREATE POLICY "public_access" ON public.item_groups FOR ALL USING (true);
CREATE POLICY "public_access" ON public.items FOR ALL USING (true);
CREATE POLICY "public_access" ON public.system_users FOR ALL USING (true);
CREATE POLICY "public_access" ON public.user_permissions FOR ALL USING (true);
CREATE POLICY "public_access" ON public.customers FOR ALL USING (true);
CREATE POLICY "public_access" ON public.addresses FOR ALL USING (true);
CREATE POLICY "public_access" ON public.customer_complaints FOR ALL USING (true);
CREATE POLICY "public_access" ON public.product_categories FOR ALL USING (true);
CREATE POLICY "public_access" ON public.products FOR ALL USING (true);
CREATE POLICY "public_access" ON public.stores FOR ALL USING (true);
CREATE POLICY "public_access" ON public.orders FOR ALL USING (true);
CREATE POLICY "public_access" ON public.order_items FOR ALL USING (true);
CREATE POLICY "public_access" ON public.vehicle_records FOR ALL USING (true);