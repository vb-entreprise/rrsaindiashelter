/*
  # Add RLS policies for roles table

  1. Changes
    - Enable RLS on roles table
    - Add policies for:
      - Authenticated users can view roles
      - Admins can manage roles
      - Admins can delete non-admin roles

  2. Security
    - Enables RLS on roles table
    - Adds granular policies for different operations
    - Protects admin role from deletion
*/

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view roles
CREATE POLICY "Authenticated can view roles"
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
  AND name <> 'admin'
);