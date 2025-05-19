/*
  # Add RLS policies for roles table

  1. Security Changes
    - Add policy to allow authenticated users to view all roles
    - This aligns with the existing application logic where:
      - All authenticated users can view roles
      - Only admins can modify roles (existing policies handle this)

  Note: This maintains the security model where viewing roles is permitted for all
  authenticated users while modifications remain restricted to admins.
*/

-- Enable RLS if not already enabled
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Add policy for viewing roles
CREATE POLICY "Authenticated users can view all roles"
ON roles
FOR SELECT
TO authenticated
USING (true);