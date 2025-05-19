/*
  # Fix RLS policies for roles and users

  1. Changes
    - Drop existing policies to avoid conflicts
    - Enable RLS on both tables
    - Add proper policies for roles table
    - Add proper policies for users table
    - Add proper policies for role_user and permission_role tables
  
  2. Security
    - Enable RLS on all tables
    - Add policies to control access based on user roles
    - Ensure admin users can manage everything
    - Allow authenticated users to view necessary data
*/

-- Enable RLS on all tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permission_role ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can view roles" ON public.roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.roles;
DROP POLICY IF EXISTS "Admins can create roles" ON public.roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.roles;
DROP POLICY IF EXISTS "Admins can delete non-admin roles" ON public.roles;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all data" ON public.users;

-- Roles table policies
CREATE POLICY "Authenticated can view roles"
ON public.roles
FOR SELECT
TO authenticated
USING (true);

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

-- Users table policies
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR
  EXISTS (
    SELECT 1 FROM public.role_user ru
    JOIN public.roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name = 'admin'
  )
);

CREATE POLICY "Admins can manage users"
ON public.users
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

-- Role user table policies
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

CREATE POLICY "Users can view own role assignments"
ON public.role_user
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Permission role table policies
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

CREATE POLICY "Users can view role permissions"
ON public.permission_role
FOR SELECT
TO authenticated
USING (true);