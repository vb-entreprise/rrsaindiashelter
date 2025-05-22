/*
  # Fix RLS policies for roles and permissions
  
  1. Changes
    - Adds existence checks before creating policies
    - Enables RLS on all relevant tables
    - Ensures authenticated users can view roles and permissions
*/

-- Ensure RLS is enabled on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_role ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Roles policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'roles' AND policyname = 'Authenticated users can view roles'
  ) THEN
    DROP POLICY "Authenticated users can view roles" ON roles;
  END IF;

  -- Permissions policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'permissions' AND policyname = 'Authenticated users can view permissions'
  ) THEN
    DROP POLICY "Authenticated users can view permissions" ON permissions;
  END IF;

  -- Role user policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'role_user' AND policyname = 'Authenticated users can view role assignments'
  ) THEN
    DROP POLICY "Authenticated users can view role assignments" ON role_user;
  END IF;

  -- Permission role policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'permission_role' AND policyname = 'Authenticated users can view permission assignments'
  ) THEN
    DROP POLICY "Authenticated users can view permission assignments" ON permission_role;
  END IF;
END $$;

-- Create new policies
CREATE POLICY "Authenticated users can view roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view permissions"
  ON permissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view role assignments"
  ON role_user
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view permission assignments"
  ON permission_role
  FOR SELECT
  TO authenticated
  USING (true);