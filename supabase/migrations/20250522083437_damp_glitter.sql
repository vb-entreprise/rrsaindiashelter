/*
  # Add RLS policies for roles table

  1. Security Changes
    - Enable RLS on roles table
    - Add policies for:
      - Authenticated users can view all roles
      - Only admins can insert/update/delete roles
      - Admin role cannot be deleted

  2. Notes
    - Ensures secure access to roles while maintaining admin control
    - Prevents unauthorized modifications to role data
    - Protects the admin role from deletion
*/

-- Enable RLS on roles table if not already enabled
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