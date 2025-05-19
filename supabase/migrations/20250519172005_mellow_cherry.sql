/*
  # Fix Case Papers RLS Policies

  1. Changes
    - Drop existing RLS policies for case_papers table
    - Create new RLS policies with proper authentication checks
    - Add policies for insert, update, delete, and select operations

  2. Security
    - Enable RLS on case_papers table
    - Add policies to ensure users can only:
      - Create case papers when authenticated
      - Update their own case papers
      - Delete their own case papers
      - View all case papers when authenticated
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create case papers" ON case_papers;
DROP POLICY IF EXISTS "Users can delete own case papers" ON case_papers;
DROP POLICY IF EXISTS "Users can update own case papers" ON case_papers;
DROP POLICY IF EXISTS "Users can view all case papers" ON case_papers;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users only" 
ON case_papers FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for users based on created_by" 
ON case_papers FOR UPDATE 
TO authenticated 
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Enable delete for users based on created_by" 
ON case_papers FOR DELETE 
TO authenticated 
USING (auth.uid() = created_by);

CREATE POLICY "Enable read access for authenticated users" 
ON case_papers FOR SELECT 
TO authenticated 
USING (true);