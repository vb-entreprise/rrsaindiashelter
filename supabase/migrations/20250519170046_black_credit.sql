/*
  # Add RLS policies for roles table

  1. Security Changes
    - Add policy for authenticated users to view roles
    - Add policy for admins to manage roles
    - Add policy for admins to delete roles

  2. Notes
    - All authenticated users can view roles
    - Only admins can create, update, and delete roles
    - Prevents deletion of the 'admin' role for system safety
*/

-- Policy to allow all authenticated users to view roles
CREATE POLICY "Authenticated users can view roles"
ON public.roles
FOR SELECT
TO authenticated
USING (true);

-- Policy to allow admins to insert roles
CREATE POLICY "Admins can create roles"
ON public.roles
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

-- Policy to allow admins to update roles
CREATE POLICY "Admins can update roles"
ON public.roles
FOR UPDATE
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

-- Policy to allow admins to delete roles (except admin role)
CREATE POLICY "Admins can delete non-admin roles"
ON public.roles
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