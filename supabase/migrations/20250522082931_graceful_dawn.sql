/*
  # Add RLS policies for roles table

  1. Changes
    - Enable RLS on roles table
    - Add policy for authenticated users to view roles
    - Add policy for admin users to manage roles
    - Add policy for admin users to delete non-admin roles

  2. Security
    - Enables row level security
    - Restricts role management to admin users
    - Prevents deletion of admin role
    - Allows all authenticated users to view roles
*/

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view roles
CREATE POLICY "Authenticated users can view roles"
ON roles
FOR SELECT
TO authenticated
USING (true);

-- Allow admin users to manage roles
CREATE POLICY "Admin users can manage roles"
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