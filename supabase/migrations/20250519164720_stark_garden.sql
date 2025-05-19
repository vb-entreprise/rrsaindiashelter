/*
  # Add RLS policies for roles table

  1. Security Changes
    - Enable RLS on roles table if not already enabled
    - Add policy for authenticated users to view all roles
    - Add policy for admins to manage roles (insert, update, delete)

  2. Notes
    - All authenticated users can view roles
    - Only admins can modify roles
*/

-- Enable RLS on roles table if not already enabled
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view all roles
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