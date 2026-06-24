-- =====================================================================
--                   LUXELOOM ROW LEVEL SECURITY (RLS) POLICIES
--     Execute this SQL snippet in your Supabase SQL Editor to secure
--        your client transactions and enforce absolute data isolation.
-- =====================================================================

-- Enable Row Level Security (RLS) on critical transactional tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 1. ORDERS TABLE POLICIES
-- ---------------------------------------------------------------------

-- POLICY: Clients can only search and view their own transactional orders
CREATE POLICY select_own_orders ON orders 
  FOR SELECT 
  TO authenticated 
  USING (
    customer_email = auth.jwt()->>'email' OR 
    customer_id = auth.uid()
  );

-- POLICY: Clients can stamp new orders inside the registry during checkout
CREATE POLICY insert_own_orders ON orders 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    customer_id = auth.uid() OR
    customer_email = auth.jwt()->>'email'
  );

-- POLICY: LuxeLoom Admin users can select any and all registered client orders
CREATE POLICY admin_select_all_orders ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt()->>'email'
    )
  );

-- POLICY: LuxeLoom Admin users can update any order (e.g., status changes, tracking)
CREATE POLICY admin_update_all_orders ON orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt()->>'email'
    )
  );


-- ---------------------------------------------------------------------
-- 2. CART ITEMS TABLE POLICIES
-- ---------------------------------------------------------------------

-- POLICY: Clients can view only their own cart cache rows
CREATE POLICY select_own_cart ON cart_items
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

-- POLICY: Clients can upsert new draft items into their own active bag
CREATE POLICY insert_own_cart ON cart_items
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- POLICY: Clients can alter options or sizes inside their own cart items
CREATE POLICY update_own_cart ON cart_items
  FOR UPDATE
  TO authenticated
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

-- POLICY: Clients can clear single or all items inside their own vault bag
CREATE POLICY delete_own_cart ON cart_items
  FOR DELETE
  TO authenticated
  USING (customer_id = auth.uid());


-- ---------------------------------------------------------------------
-- 3. WISHLIST TABLE POLICIES
-- ---------------------------------------------------------------------

-- POLICY: Clients can view only their own wishlist curated favorites
CREATE POLICY select_own_wishlist ON wishlist
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

-- POLICY: Clients can record new items on their own wishlist index
CREATE POLICY insert_own_wishlist ON wishlist
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- POLICY: Clients can remove items from their own wishlist
CREATE POLICY delete_own_wishlist ON wishlist
  FOR DELETE
  TO authenticated
  USING (customer_id = auth.uid());


-- ---------------------------------------------------------------------
-- 4. ADMINISTRATIVE POLICIES FOR OVERRIDE & ORCHESTRATION
-- ---------------------------------------------------------------------

-- For orders table admin policy:
-- Admin email: dipak08v14@gmail.com
CREATE POLICY "Admin sees all orders"
ON public.orders FOR SELECT
USING (
  auth.email() = 'dipak08v14@gmail.com'
  OR 
  auth.email() = customer_email
);

-- For wishlist table admin policy:
CREATE POLICY "Admin sees all wishlists"
ON public.wishlist FOR SELECT
USING (
  auth.email() = 'dipak08v14@gmail.com'
  OR
  auth.uid()::text = customer_id::text
);

-- For cart table admin policy:
CREATE POLICY "Admin sees all carts"
ON public.cart_items FOR SELECT
USING (
  auth.email() = 'dipak08v14@gmail.com'
  OR
  auth.uid()::text = customer_id::text
);


-- ---------------------------------------------------------------------
-- Verification Check: Confirm RLS states
-- ---------------------------------------------------------------------
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
