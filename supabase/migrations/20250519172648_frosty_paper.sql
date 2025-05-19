/*
  # Fix Case Papers RLS Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new policies for case papers table
    - Add trigger for automatically setting created_by

  2. Security
    - Enable RLS on case_papers table
    - Add policies for:
      - Insert: Any authenticated user can create
      - Select: Any authenticated user can view
      - Update: Users can update their own records
      - Delete: Users can delete their own records
    - Automatically set created_by to auth.uid()
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON case_papers;
DROP POLICY IF EXISTS "Enable update for users based on created_by" ON case_papers;
DROP POLICY IF EXISTS "Enable delete for users based on created_by" ON case_papers;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON case_papers;

-- Enable RLS
ALTER TABLE case_papers ENABLE ROW LEVEL SECURITY;

-- Create insert policy
CREATE POLICY "Enable insert for authenticated users only"
ON case_papers
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create select policy
CREATE POLICY "Enable read access for authenticated users"
ON case_papers
FOR SELECT
TO authenticated
USING (true);

-- Create update policy
CREATE POLICY "Enable update for users based on created_by"
ON case_papers
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Create delete policy
CREATE POLICY "Enable delete for users based on created_by"
ON case_papers
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION set_case_paper_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_case_paper_created_by_trigger ON case_papers;

-- Create trigger
CREATE TRIGGER set_case_paper_created_by_trigger
  BEFORE INSERT ON case_papers
  FOR EACH ROW
  EXECUTE FUNCTION set_case_paper_created_by();