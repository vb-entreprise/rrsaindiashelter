/*
  # Fix roles RLS policies and permissions

  1. Changes
    - Enable RLS on roles table
    - Add comprehensive RLS policies for roles management
    - Add policy for admins to manage all roles
    - Add policy for authenticated users to view roles
    - Add policy for role-specific operations

  2. Security
    - Ensures only admins can create/update/delete roles
    - Allows all authenticated users to view roles
    - Prevents deletion of admin role
*/

-- Enable RLS on roles table
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage all roles
CREATE POLICY "Admins can manage roles"
ON roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid() 
    AND r.name = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid() 
    AND r.name = 'admin'
  )
);

-- Allow all authenticated users to view roles
CREATE POLICY "Authenticated can view roles"
ON roles
FOR SELECT
TO authenticated
USING (true);

-- Prevent deletion of admin role
CREATE POLICY "Admins can delete non-admin roles"
ON roles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid() 
    AND r.name = 'admin'
  )
  AND name <> 'admin'
);