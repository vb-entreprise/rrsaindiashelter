/*
  # Fix roles table policies

  1. Changes
    - Adds RLS policies for roles table with existence checks
    - Allows authenticated users to view roles
    - Allows admins to create, update, and delete roles
    - Prevents deletion of admin role

  2. Security
    - Ensures proper access control for roles management
    - Only admins can modify roles
    - Protects admin role from deletion
*/

DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Authenticated users can view roles" ON public.roles;
  DROP POLICY IF EXISTS "Admins can create roles" ON public.roles;
  DROP POLICY IF EXISTS "Admins can update roles" ON public.roles;
  DROP POLICY IF EXISTS "Admins can delete non-admin roles" ON public.roles;
  
  -- Create new policies
  CREATE POLICY "Authenticated users can view roles"
  ON public.roles
  FOR SELECT
  TO authenticated
  USING (true);

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
END $$;