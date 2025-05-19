/*
  # Fix roles table RLS policies
  
  1. Changes
    - Drop existing RLS policies
    - Create new RLS policies with proper permissions
  
  2. Security
    - Enable RLS on roles table
    - Add policy for authenticated users to view roles
    - Add policy for admins to manage roles
*/

-- First, drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can view roles" ON roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON roles;

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view roles
CREATE POLICY "Authenticated users can view roles"
ON roles
FOR SELECT
TO authenticated
USING (true);

-- Allow admins to manage roles
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
);