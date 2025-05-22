/*
  # Fix roles table policies
  
  1. Changes
    - Drop existing policies to avoid duplicates
    - Recreate policies for roles table
    
  2. Security
    - Enable RLS
    - Add policies for viewing, creating, updating and deleting roles
    - Protect admin role from modification
*/

-- First drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view roles" ON roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON roles;
DROP POLICY IF EXISTS "Admins can update non-admin roles" ON roles;
DROP POLICY IF EXISTS "Admins can delete non-admin roles" ON roles;

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view roles
CREATE POLICY "Authenticated users can view roles"
ON roles
FOR SELECT
TO authenticated
USING (true);

-- Allow admins to insert roles
CREATE POLICY "Admins can insert roles"
ON roles
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name = 'admin'
  )
);

-- Allow admins to update non-admin roles
CREATE POLICY "Admins can update non-admin roles"
ON roles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name = 'admin'
  )
  AND name != 'admin'
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name = 'admin'
  )
  AND name != 'admin'
);

-- Allow admins to delete non-admin roles
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
  AND name != 'admin'
);