/*
  # Update RLS policies for roles table

  1. Security Changes
    - Enable RLS on roles table
    - Add policy for authenticated users to view roles
    - Add policy for admins to manage roles
    - Add policy for authenticated users to view their own roles

  2. Notes
    - All authenticated users can view roles
    - Only admins can create, update, or delete roles
    - Users can view roles they are assigned to
*/

-- Enable RLS on roles table if not already enabled
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Authenticated users can view roles" ON roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON roles;

-- Policy for all authenticated users to view roles
CREATE POLICY "Authenticated users can view roles"
ON roles
FOR SELECT
TO authenticated
USING (true);

-- Policy for admins to manage roles (CRUD operations)
CREATE POLICY "Admins can manage roles"
ON roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name = 'admin'
  )
);