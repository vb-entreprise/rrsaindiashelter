/*
  # Add user role view policy
  
  Adds a policy allowing users to view their own role assignments.
  
  1. New Policies
    - Users can view their own role assignments
*/

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