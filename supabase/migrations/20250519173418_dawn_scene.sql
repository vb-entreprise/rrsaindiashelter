/*
  # Add RLS policies for roles table

  1. Security Changes
    - Enable RLS on roles table
    - Add policies for:
      - Authenticated users can view all roles
      - Only admins can insert new roles
      - Only admins can update roles
      - Only admins can delete non-admin roles

  2. Notes
    - Policies ensure that:
      - All authenticated users can read roles (needed for basic functionality)
      - Only admin users can manage roles
      - The 'admin' role cannot be deleted for system security
*/

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Policy for viewing roles (all authenticated users can view)
CREATE POLICY "Authenticated users can view roles"
ON roles
FOR SELECT
TO authenticated
USING (true);

-- Policy for inserting roles (only admins)
CREATE POLICY "Only admins can insert roles"
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

-- Policy for updating roles (only admins)
CREATE POLICY "Only admins can update roles"
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
);

-- Policy for deleting roles (only admins, and cannot delete admin role)
CREATE POLICY "Only admins can delete non-admin roles"
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