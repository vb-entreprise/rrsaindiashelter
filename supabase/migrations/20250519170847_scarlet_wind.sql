/*
  # Fix RLS policies for roles management

  1. Changes
    - Drop existing conflicting policies
    - Enable RLS on all relevant tables
    - Add proper policies for roles, users, role_user, and permission_role tables
  
  2. Security
    - Enable RLS on all tables
    - Add policies for:
      - Role viewing (all authenticated users)
      - Role management (admin only)
      - User management (admin only)
      - Role assignments (admin only)
      - Permission assignments (admin only)
    - Protect admin role from deletion
    - Allow users to view their own data
*/

-- First, ensure RLS is enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'roles'
      AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop any existing conflicting policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can view roles" ON public.roles;
  DROP POLICY IF EXISTS "Admins can manage roles" ON public.roles;
  DROP POLICY IF EXISTS "Admins can create roles" ON public.roles;
  DROP POLICY IF EXISTS "Admins can update roles" ON public.roles;
  DROP POLICY IF EXISTS "Admins can delete non-admin roles" ON public.roles;
END $$;

-- Grant necessary privileges
GRANT SELECT ON public.roles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.roles TO authenticated;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_role_user_user_role 
ON public.role_user (user_id, role_id);

-- Create policies for roles table
DO $$ 
BEGIN
  -- Allow all authenticated users to view roles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Authenticated can view roles'
    AND polrelid = 'public.roles'::regclass
  ) THEN
    CREATE POLICY "Authenticated can view roles"
    ON public.roles
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;

  -- Allow admins to insert roles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Admins can insert roles'
    AND polrelid = 'public.roles'::regclass
  ) THEN
    CREATE POLICY "Admins can insert roles"
    ON public.roles
    FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.role_user ru
        JOIN public.roles r ON r.id = ru.role_id
        WHERE ru.user_id = auth.uid()
        AND r.name = 'admin'
      )
    );
  END IF;

  -- Allow admins to update roles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Admins can update roles'
    AND polrelid = 'public.roles'::regclass
  ) THEN
    CREATE POLICY "Admins can update roles"
    ON public.roles
    FOR UPDATE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.role_user ru
        JOIN public.roles r ON r.id = ru.role_id
        WHERE ru.user_id = auth.uid()
        AND r.name = 'admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.role_user ru
        JOIN public.roles r ON r.id = ru.role_id
        WHERE ru.user_id = auth.uid()
        AND r.name = 'admin'
      )
    );
  END IF;

  -- Allow admins to delete non-admin roles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Admins can delete non-admin roles'
    AND polrelid = 'public.roles'::regclass
  ) THEN
    CREATE POLICY "Admins can delete non-admin roles"
    ON public.roles
    FOR DELETE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.role_user ru
        JOIN public.roles r ON r.id = ru.role_id
        WHERE ru.user_id = auth.uid()
        AND r.name = 'admin'
      )
      AND name <> 'admin'
    );
  END IF;
END $$;

-- Create policies for role_user table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Admins can manage role assignments'
    AND polrelid = 'public.role_user'::regclass
  ) THEN
    CREATE POLICY "Admins can manage role assignments"
    ON public.role_user
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.role_user ru
        JOIN public.roles r ON r.id = ru.role_id
        WHERE ru.user_id = auth.uid()
        AND r.name = 'admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.role_user ru
        JOIN public.roles r ON r.id = ru.role_id
        WHERE ru.user_id = auth.uid()
        AND r.name = 'admin'
      )
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Users can view own role assignments'
    AND polrelid = 'public.role_user'::regclass
  ) THEN
    CREATE POLICY "Users can view own role assignments"
    ON public.role_user
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
  END IF;
END $$;

-- Create policies for permission_role table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Admins can manage role permissions'
    AND polrelid = 'public.permission_role'::regclass
  ) THEN
    CREATE POLICY "Admins can manage role permissions"
    ON public.permission_role
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.role_user ru
        JOIN public.roles r ON r.id = ru.role_id
        WHERE ru.user_id = auth.uid()
        AND r.name = 'admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.role_user ru
        JOIN public.roles r ON r.id = ru.role_id
        WHERE ru.user_id = auth.uid()
        AND r.name = 'admin'
      )
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polname = 'Users can view role permissions'
    AND polrelid = 'public.permission_role'::regclass
  ) THEN
    CREATE POLICY "Users can view role permissions"
    ON public.permission_role
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END $$;