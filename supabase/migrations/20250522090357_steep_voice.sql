/*
  # Add admin role management policy
  
  1. Changes
    - Adds policy for admins to manage roles
    - Adds policy for users to view their own roles
  
  Note: The authenticated users view policy already exists, so it's not included
*/

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