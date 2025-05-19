/*
  # Update RRSA India NGO Database Schema
  
  1. New Tables
    - case_papers: Track animal cases and treatments
    - feeding_records: Track animal feeding schedules
    - cleaning_records: Track facility cleaning
    - inventory_items: Track supplies and equipment
    - inward_inventory: Track inventory additions
    - outward_inventory: Track inventory usage
    - activity_logs: Track system activities
  
  2. Enums
    - animal_type_enum: Types of animals
    - gender_enum: Gender options
    - status_enum: Case status options
    - inventory_category_enum: Inventory categories
  
  3. Security
    - All tables have proper foreign key constraints
    - Triggers for updated_at timestamps
*/

-- Create custom enums if they don't exist
DO $$ BEGIN
    CREATE TYPE animal_type_enum AS ENUM ('dog', 'cat', 'bird', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gender_enum AS ENUM ('male', 'female', 'unknown');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE status_enum AS ENUM ('active', 'discharged', 'deceased');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inventory_category_enum AS ENUM ('food', 'medicine', 'equipment', 'supplies', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create case_papers table if it doesn't exist
CREATE TABLE IF NOT EXISTS case_papers (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    admission_date DATE,
    informer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    alt_phone VARCHAR(15),
    aadhar VARCHAR(20),
    animal_type animal_type_enum NOT NULL,
    animal_name VARCHAR(50),
    gender gender_enum NOT NULL,
    treatment TEXT NOT NULL,
    by_whom VARCHAR(255) NOT NULL,
    status status_enum NOT NULL DEFAULT 'active',
    image_path VARCHAR(255),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create feeding_records table if it doesn't exist
CREATE TABLE IF NOT EXISTS feeding_records (
    id SERIAL PRIMARY KEY,
    case_paper_id INT NOT NULL REFERENCES case_papers(id) ON DELETE CASCADE,
    morning_value DECIMAL(10,2),
    evening_value DECIMAL(10,2),
    date DATE NOT NULL,
    time TIME NOT NULL,
    by_whom VARCHAR(255) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cleaning_records table if it doesn't exist
CREATE TABLE IF NOT EXISTS cleaning_records (
    id SERIAL PRIMARY KEY,
    area VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    by_whom VARCHAR(255) NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory tables if they don't exist
CREATE TABLE IF NOT EXISTS inventory_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category inventory_category_enum NOT NULL,
    unit VARCHAR(50) NOT NULL,
    minimum_level INT,
    current_stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inward_inventory (
    id SERIAL PRIMARY KEY,
    item_id INT NOT NULL REFERENCES inventory_items(id),
    quantity INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    given_by VARCHAR(255) NOT NULL,
    received_by VARCHAR(255) NOT NULL,
    placed_at VARCHAR(255),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS outward_inventory (
    id SERIAL PRIMARY KEY,
    item_id INT NOT NULL REFERENCES inventory_items(id),
    quantity INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    taken_by VARCHAR(255) NOT NULL,
    authorized_by VARCHAR(255) NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    type VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    subject_id INT,
    subject_type VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for all tables with updated_at
DROP TRIGGER IF EXISTS set_case_papers_updated_at ON case_papers;
CREATE TRIGGER set_case_papers_updated_at
    BEFORE UPDATE ON case_papers
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

DROP TRIGGER IF EXISTS set_feeding_records_updated_at ON feeding_records;
CREATE TRIGGER set_feeding_records_updated_at
    BEFORE UPDATE ON feeding_records
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

DROP TRIGGER IF EXISTS set_cleaning_records_updated_at ON cleaning_records;
CREATE TRIGGER set_cleaning_records_updated_at
    BEFORE UPDATE ON cleaning_records
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

DROP TRIGGER IF EXISTS set_inventory_items_updated_at ON inventory_items;
CREATE TRIGGER set_inventory_items_updated_at
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

DROP TRIGGER IF EXISTS set_inward_inventory_updated_at ON inward_inventory;
CREATE TRIGGER set_inward_inventory_updated_at
    BEFORE UPDATE ON inward_inventory
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

DROP TRIGGER IF EXISTS set_outward_inventory_updated_at ON outward_inventory;
CREATE TRIGGER set_outward_inventory_updated_at
    BEFORE UPDATE ON outward_inventory
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at();

-- Enable RLS on all tables
ALTER TABLE case_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inward_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE outward_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can view case papers"
    ON case_papers FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert case papers"
    ON case_papers FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own case papers"
    ON case_papers FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can view feeding records"
    ON feeding_records FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert feeding records"
    ON feeding_records FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can view cleaning records"
    ON cleaning_records FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert cleaning records"
    ON cleaning_records FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can view inventory"
    ON inventory_items FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can view inward inventory"
    ON inward_inventory FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can view outward inventory"
    ON outward_inventory FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can view activity logs"
    ON activity_logs FOR SELECT
    TO authenticated
    USING (true);