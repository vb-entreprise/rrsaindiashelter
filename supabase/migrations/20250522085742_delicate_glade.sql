/*
  # Add RLS policies for roles table

  1. Security Changes
    - Add RLS policy to allow authenticated users to view roles
    - Add RLS policy to allow admins to manage roles
    - Add RLS policy to allow authenticated users to view their own roles

  Note: These policies ensure proper access control while maintaining security
*/

-- Policy to allow authenticated users to view roles
CREATE POLICY "Authenticated users can view roles"
ON public.roles
FOR SELECT
TO authenticated
USING (true);

-- Policy to allow admins to manage roles
CREATE POLICY "Admins can manage roles"
ON public.roles
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

-- Policy to allow users to view their own roles
CREATE POLICY "Users can view own roles"
ON public.roles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    WHERE ru.user_id = auth.uid()
    AND ru.role_id = roles.id
  )
);