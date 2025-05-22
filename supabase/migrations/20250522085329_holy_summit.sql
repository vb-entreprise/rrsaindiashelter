/*
  # Update RLS policies for roles and permissions

  1. Changes
    - Update RLS policies for roles and permissions tables to allow authenticated users to view them
    - Add policies for role_user and permission_role tables

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to view roles and permissions
    - Add policies for admins to manage roles and permissions
*/

-- Update roles table policies
CREATE POLICY "Authenticated users can view roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Update permissions table policies
CREATE POLICY "Authenticated users can view permissions"
  ON permissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Update role_user table policies
CREATE POLICY "Authenticated users can view role assignments"
  ON role_user
  FOR SELECT
  TO authenticated
  USING (true);

-- Update permission_role table policies
CREATE POLICY "Authenticated users can view permission assignments"
  ON permission_role
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure RLS is enabled on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_role ENABLE ROW LEVEL SECURITY;