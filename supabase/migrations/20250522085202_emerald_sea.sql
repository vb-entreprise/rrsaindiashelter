/*
  # Add RLS policies for roles management
  
  1. Changes
    - Enable RLS on roles and permission_role tables
    - Add policies for role management with existence checks
    - Add policies for permission assignments with existence checks
  
  2. Security
    - Admins get full access to manage roles and permissions
    - All authenticated users can view roles and permissions
    - Prevents duplicate policy creation
*/

-- Enable RLS on roles table if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'roles' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Policy for admins to manage roles (full access)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'roles' 
    AND policyname = 'Admins can manage roles'
  ) THEN
    CREATE POLICY "Admins can manage roles"
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
      );
  END IF;
END $$;

-- Policy for authenticated users to view roles (read-only)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'roles' 
    AND policyname = 'Authenticated users can view roles'
  ) THEN
    CREATE POLICY "Authenticated users can view roles"
      ON roles
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Enable RLS on permission_role table if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'permission_role' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE permission_role ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Policy for admins to manage permission assignments
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'permission_role' 
    AND policyname = 'Admins can manage permission assignments'
  ) THEN
    CREATE POLICY "Admins can manage permission assignments"
      ON permission_role
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
  END IF;
END $$;

-- Policy for authenticated users to view permission assignments
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'permission_role' 
    AND policyname = 'Authenticated users can view permission assignments'
  ) THEN
    CREATE POLICY "Authenticated users can view permission assignments"
      ON permission_role
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;