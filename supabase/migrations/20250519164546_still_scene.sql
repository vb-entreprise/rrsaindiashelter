/*
  # Add RLS policies for roles table
  
  1. Security Changes
    - Add RLS policies for roles table to allow:
      - Authenticated users to view roles
      - Admin users to manage roles
  
  2. Notes
    - Maintains existing RLS enabled state
    - Adds granular access control
*/

-- Allow authenticated users to view roles
CREATE POLICY "Authenticated users can view roles" ON roles
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow admin users to manage roles
CREATE POLICY "Admins can manage roles" ON roles
    FOR ALL 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM role_user ru
            JOIN roles r ON r.id = ru.role_id
            WHERE ru.user_id = auth.uid()
            AND r.name = 'admin'
        )
    );