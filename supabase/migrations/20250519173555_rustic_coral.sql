/*
  # Update roles table RLS policies

  1. Changes
    - Simplify RLS policies for roles table
    - Add basic read access for authenticated users
    - Maintain admin-only write access
  
  2. Security
    - Enable RLS on roles table (already enabled)
    - Update policies to ensure proper access control
    - Maintain admin-specific operations
*/

-- Drop existing policies to clean up
DROP POLICY IF EXISTS "Authenticated can view roles" ON roles;
DROP POLICY IF EXISTS "Authenticated users can view roles" ON roles;
DROP POLICY IF EXISTS "Only admins can delete non-admin roles" ON roles;
DROP POLICY IF EXISTS "Only admins can insert roles" ON roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON roles;
DROP POLICY IF EXISTS "Admins can delete non-admin roles" ON roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON roles;
DROP POLICY IF EXISTS "Admins can update roles" ON roles;

-- Create simplified policies
CREATE POLICY "Enable read access for authenticated users"
ON roles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable admin write access"
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