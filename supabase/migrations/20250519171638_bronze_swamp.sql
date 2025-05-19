/*
  # Add RLS policies for case_papers table

  1. Security Changes
    - Enable RLS on case_papers table (if not already enabled)
    - Add policies for authenticated users to:
      - Insert new case papers
      - Update their own case papers
      - View all case papers
      - Delete their own case papers
    
  2. Notes
    - Policies ensure users can only modify their own records
    - All authenticated users can view all case papers
    - Created_by field is used to track ownership
*/

-- Enable RLS
ALTER TABLE case_papers ENABLE ROW LEVEL SECURITY;

-- Policy for inserting new case papers
CREATE POLICY "Users can create case papers"
ON case_papers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Policy for viewing case papers
CREATE POLICY "Users can view all case papers"
ON case_papers
FOR SELECT
TO authenticated
USING (true);

-- Policy for updating own case papers
CREATE POLICY "Users can update own case papers"
ON case_papers
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Policy for deleting own case papers
CREATE POLICY "Users can delete own case papers"
ON case_papers
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);