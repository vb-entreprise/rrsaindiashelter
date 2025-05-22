/*
  # Fix roles table policies

  1. Changes
    - Enable RLS on roles table
    - Add policies for role management:
      - View policy for authenticated users
      - Management policy for admin users
      - Delete policy for admin users (non-admin roles only)
    
  2. Security
    - Ensures admin users can manage roles
    - Prevents non-admin users from modifying roles
    - Protects admin role from deletion
*/

-- Enable RLS if not already enabled
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can view roles" ON roles;
    DROP POLICY IF EXISTS "Authenticated can view roles" ON roles;
    DROP POLICY IF EXISTS "Admin users can manage roles" ON roles;
    DROP POLICY IF EXISTS "Admins can manage roles" ON roles;
    DROP POLICY IF EXISTS "Admins can delete non-admin roles" ON roles;
END $$;

-- Allow authenticated users to view roles
CREATE POLICY "Authenticated can view roles"
ON roles
FOR SELECT
TO authenticated
USING (true);

-- Allow admin users to manage roles
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

-- Allow admin users to delete non-admin roles
CREATE POLICY "Admins can delete non-admin roles"
ON roles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name = 'admin'
  )
  AND name <> 'admin'
);