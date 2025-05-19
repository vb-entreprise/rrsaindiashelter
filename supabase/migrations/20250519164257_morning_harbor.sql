/*
  # RRSA India NGO Database Structure
  
  This migration sets up the core database structure for the RRSA India animal shelter management system.
  
  1. Custom Types
     - animal_type_enum: Types of animals (dog, cat, bird, other)
     - gender_enum: Animal gender options
     - status_enum: Case paper status options
     - inventory_category_enum: Inventory item categories
  
  2. Core Tables
     - users: User accounts and authentication
     - roles: User roles (admin, doctor, staff, volunteer)
     - permissions: Available system permissions
     - case_papers: Animal case records
     - feeding_records: Animal feeding tracking
     - cleaning_records: Facility cleaning logs
     - inventory_items: Supply inventory
     - activity_logs: System activity tracking
  
  3. Security
     - Row Level Security enabled on all tables
     - Role-based access control
     - Secure policies for data access
*/

-- Drop existing tables with CASCADE to handle dependencies
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS outward_inventory CASCADE;
DROP TABLE IF EXISTS inward_inventory CASCADE;
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS cleaning_records CASCADE;
DROP TABLE IF EXISTS feeding_records CASCADE;
DROP TABLE IF EXISTS case_papers CASCADE;
DROP TABLE IF EXISTS permission_role CASCADE;
DROP TABLE IF EXISTS role_user CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS inventory_category_enum CASCADE;
DROP TYPE IF EXISTS status_enum CASCADE;
DROP TYPE IF EXISTS gender_enum CASCADE;
DROP TYPE IF EXISTS animal_type_enum CASCADE;

-- Create custom types
CREATE TYPE animal_type_enum AS ENUM ('dog', 'cat', 'bird', 'other');
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'unknown');
CREATE TYPE status_enum AS ENUM ('active', 'discharged', 'deceased');
CREATE TYPE inventory_category_enum AS ENUM ('food', 'medicine', 'equipment', 'supplies', 'other');

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    remember_token VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    guard_name VARCHAR(255) NOT NULL DEFAULT 'web',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    guard_name VARCHAR(255) NOT NULL DEFAULT 'web',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_user (
    role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, user_id)
);

CREATE TABLE IF NOT EXISTS permission_role (
    permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
    role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (permission_id, role_id)
);

CREATE TABLE IF NOT EXISTS case_papers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feeding_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    case_paper_id uuid NOT NULL REFERENCES case_papers(id) ON DELETE CASCADE,
    morning_value DECIMAL(10,2),
    evening_value DECIMAL(10,2),
    date DATE NOT NULL,
    time TIME NOT NULL,
    by_whom VARCHAR(255) NOT NULL,
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cleaning_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    area VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    by_whom VARCHAR(255) NOT NULL,
    notes TEXT,
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category inventory_category_enum NOT NULL,
    unit VARCHAR(50) NOT NULL,
    minimum_level INT,
    current_stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inward_inventory (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id uuid NOT NULL REFERENCES inventory_items(id),
    quantity INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    given_by VARCHAR(255) NOT NULL,
    received_by VARCHAR(255) NOT NULL,
    placed_at VARCHAR(255),
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS outward_inventory (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id uuid NOT NULL REFERENCES inventory_items(id),
    quantity INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    taken_by VARCHAR(255) NOT NULL,
    authorized_by VARCHAR(255) NOT NULL,
    notes TEXT,
    created_by uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    subject_id uuid,
    subject_type VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for all tables with updated_at
DO $$ 
BEGIN
    CREATE TRIGGER set_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION set_updated_at();
    
    CREATE TRIGGER set_roles_updated_at
        BEFORE UPDATE ON roles
        FOR EACH ROW
        EXECUTE FUNCTION set_updated_at();
    
    CREATE TRIGGER set_permissions_updated_at
        BEFORE UPDATE ON permissions
        FOR EACH ROW
        EXECUTE FUNCTION set_updated_at();
    
    CREATE TRIGGER set_case_papers_updated_at
        BEFORE UPDATE ON case_papers
        FOR EACH ROW
        EXECUTE FUNCTION set_updated_at();
    
    CREATE TRIGGER set_feeding_records_updated_at
        BEFORE UPDATE ON feeding_records
        FOR EACH ROW
        EXECUTE FUNCTION set_updated_at();
    
    CREATE TRIGGER set_cleaning_records_updated_at
        BEFORE UPDATE ON cleaning_records
        FOR EACH ROW
        EXECUTE FUNCTION set_updated_at();
    
    CREATE TRIGGER set_inventory_items_updated_at
        BEFORE UPDATE ON inventory_items
        FOR EACH ROW
        EXECUTE FUNCTION set_updated_at();
    
    CREATE TRIGGER set_inward_inventory_updated_at
        BEFORE UPDATE ON inward_inventory
        FOR EACH ROW
        EXECUTE FUNCTION set_updated_at();
    
    CREATE TRIGGER set_outward_inventory_updated_at
        BEFORE UPDATE ON outward_inventory
        FOR EACH ROW
        EXECUTE FUNCTION set_updated_at();
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Insert default roles
INSERT INTO roles (name) VALUES 
    ('admin'),
    ('doctor'),
    ('staff'),
    ('volunteer')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name) VALUES
    ('view-case-papers'),
    ('create-case-papers'),
    ('edit-case-papers'),
    ('delete-case-papers'),
    ('view-feeding'),
    ('create-feeding'),
    ('edit-feeding'),
    ('delete-feeding'),
    ('view-cleaning'),
    ('create-cleaning'),
    ('edit-cleaning'),
    ('delete-cleaning'),
    ('view-inventory'),
    ('create-inventory'),
    ('edit-inventory'),
    ('delete-inventory'),
    ('view-users'),
    ('create-users'),
    ('edit-users'),
    ('delete-users'),
    ('view-roles'),
    ('create-roles'),
    ('edit-roles'),
    ('delete-roles')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inward_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE outward_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Admins can manage all data" ON users
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_case_papers_date ON case_papers(date);
CREATE INDEX IF NOT EXISTS idx_case_papers_status ON case_papers(status);
CREATE INDEX IF NOT EXISTS idx_feeding_records_date ON feeding_records(date);
CREATE INDEX IF NOT EXISTS idx_cleaning_records_date ON cleaning_records(date);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);