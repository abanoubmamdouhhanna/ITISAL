-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.store_setup;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.region_setup;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.store_region_links;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.item_groups;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.items;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.system_users;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.user_permissions;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.customers;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.addresses;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.customer_complaints;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.product_categories;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.products;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.stores;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.orders;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.order_items;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.vehicle_records;

-- Create permissive policies allowing all operations (since you're using custom auth)
CREATE POLICY "Allow all operations" ON public.store_setup FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.region_setup FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.store_region_links FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.item_groups FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.items FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.system_users FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.user_permissions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.customers FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.addresses FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.customer_complaints FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.product_categories FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.stores FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.order_items FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON public.vehicle_records FOR ALL USING (true);