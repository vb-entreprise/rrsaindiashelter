/*
  # Add RLS policies for roles management

  1. Changes
    - Enable RLS on roles table if not already enabled
    - Add policies for:
      - Admins to manage roles (full access)
      - Authenticated users to view roles (read-only access)

  2. Security
    - Ensures only admins can modify roles
    - Allows all authenticated users to view roles
    - Prevents unauthorized access to role management
*/

-- Enable RLS on roles table if not already enabled
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage roles (full access)
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
  );

-- Policy for authenticated users to view roles (read-only)
CREATE POLICY "Authenticated users can view roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Enable RLS on permission_role table if not already enabled
ALTER TABLE permission_role ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage permission assignments
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

-- Policy for authenticated users to view permission assignments
CREATE POLICY "Authenticated users can view permission assignments"
  ON permission_role
  FOR SELECT
  TO authenticated
  USING (true);