/*
  # Fix Case Papers RLS Policies

  1. Changes
    - Update INSERT policy to properly set created_by field
    - Ensure created_by is automatically set to the authenticated user's ID
    - Allow authenticated users to create case papers

  2. Security
    - Maintain existing RLS policies for SELECT, UPDATE, and DELETE
    - Ensure created_by is always set to prevent orphaned records
*/

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Users can create case papers" ON case_papers;

-- Create new INSERT policy that automatically sets created_by
CREATE POLICY "Users can create case papers" ON case_papers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Ensure the user is authenticated
    auth.uid() IS NOT NULL
  );

-- Create a trigger to automatically set created_by
CREATE OR REPLACE FUNCTION public.set_case_paper_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_case_paper_created_by_trigger ON case_papers;

-- Create trigger to set created_by
CREATE TRIGGER set_case_paper_created_by_trigger
  BEFORE INSERT ON case_papers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_case_paper_created_by();