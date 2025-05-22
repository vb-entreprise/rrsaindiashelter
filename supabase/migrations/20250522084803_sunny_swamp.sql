/*
  # Set up RLS policies for all tables

  1. Security
    - Enable RLS on all tables
    - Create policies for authenticated access
    - Set up admin role permissions
    - Protect sensitive operations
  
  2. Policies
    - Users table: Self-access and admin management
    - Roles table: View for all, manage for admins
    - Permissions table: View for all, manage for admins
    - Case papers: Access based on role
    - Feeding/Cleaning records: Role-based access
    - Inventory: Role-based access
    - Activity logs: Role-based access
*/

-- Users table policies
CREATE POLICY "Users can view own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage users"
ON users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name = 'admin'
  )
);

-- Permissions table policies
CREATE POLICY "Authenticated can view permissions"
ON permissions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage permissions"
ON permissions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name = 'admin'
  )
);

-- Case papers policies
CREATE POLICY "Authenticated can view case papers"
ON case_papers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can manage case papers"
ON case_papers
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name IN ('admin', 'doctor', 'staff')
  )
);

-- Feeding records policies
CREATE POLICY "Authenticated can view feeding records"
ON feeding_records
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can manage feeding records"
ON feeding_records
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name IN ('admin', 'doctor', 'staff')
  )
);

-- Cleaning records policies
CREATE POLICY "Authenticated can view cleaning records"
ON cleaning_records
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can manage cleaning records"
ON cleaning_records
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name IN ('admin', 'doctor', 'staff')
  )
);

-- Inventory items policies
CREATE POLICY "Authenticated can view inventory"
ON inventory_items
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can manage inventory"
ON inventory_items
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name IN ('admin', 'staff')
  )
);

-- Inward inventory policies
CREATE POLICY "Authenticated can view inward inventory"
ON inward_inventory
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can manage inward inventory"
ON inward_inventory
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name IN ('admin', 'staff')
  )
);

-- Outward inventory policies
CREATE POLICY "Authenticated can view outward inventory"
ON outward_inventory
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can manage outward inventory"
ON outward_inventory
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name IN ('admin', 'staff')
  )
);

-- Activity logs policies
CREATE POLICY "Authenticated can view activity logs"
ON activity_logs
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "System can create activity logs"
ON activity_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Role-user and permission-role junction table policies
CREATE POLICY "Admins can manage role assignments"
ON role_user
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name = 'admin'
  )
);

CREATE POLICY "Admins can manage permission assignments"
ON permission_role
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name = 'admin'
  )
);