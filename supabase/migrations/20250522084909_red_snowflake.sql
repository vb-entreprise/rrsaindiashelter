/*
  # Initial Database Setup
  
  1. Tables
    - Creates all required tables with proper schemas
    - Sets up foreign key relationships
    - Adds necessary indexes
  
  2. Security
    - Enables RLS on all tables
    - Sets up role-based access policies
    - Implements proper data isolation
*/

-- Create enum types
CREATE TYPE animal_type_enum AS ENUM ('bird', 'cat', 'dog', 'other');
CREATE TYPE gender_enum AS ENUM ('female', 'male', 'unknown');
CREATE TYPE status_enum AS ENUM ('active', 'deceased', 'discharged');
CREATE TYPE inventory_category_enum AS ENUM ('equipment', 'food', 'medicine', 'other', 'supplies');

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  phone varchar(15) NOT NULL,
  remember_token varchar(100),
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) UNIQUE NOT NULL,
  guard_name varchar(255) NOT NULL DEFAULT 'web',
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create permissions table
CREATE TABLE permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) UNIQUE NOT NULL,
  guard_name varchar(255) NOT NULL DEFAULT 'web',
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create role_user junction table
CREATE TABLE role_user (
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, user_id)
);

-- Create permission_role junction table
CREATE TABLE permission_role (
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (permission_id, role_id)
);

-- Create case_papers table
CREATE TABLE case_papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  admission_date date,
  informer_name varchar(255) NOT NULL,
  phone varchar(15) NOT NULL,
  alt_phone varchar(15),
  aadhar varchar(20),
  animal_type animal_type_enum NOT NULL,
  animal_name varchar(50),
  gender gender_enum NOT NULL,
  treatment text NOT NULL,
  by_whom varchar(255) NOT NULL,
  status status_enum DEFAULT 'active' NOT NULL,
  image_path varchar(255),
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create feeding_records table
CREATE TABLE feeding_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_paper_id uuid REFERENCES case_papers(id) ON DELETE CASCADE NOT NULL,
  morning_value numeric(10,2),
  evening_value numeric(10,2),
  date date NOT NULL,
  time time NOT NULL,
  by_whom varchar(255) NOT NULL,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create cleaning_records table
CREATE TABLE cleaning_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area varchar(255) NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  by_whom varchar(255) NOT NULL,
  notes text,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory_items table
CREATE TABLE inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  category inventory_category_enum NOT NULL,
  unit varchar(50) NOT NULL,
  minimum_level integer,
  current_stock integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create inward_inventory table
CREATE TABLE inward_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES inventory_items(id) NOT NULL,
  quantity integer NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  given_by varchar(255) NOT NULL,
  received_by varchar(255) NOT NULL,
  placed_at varchar(255),
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create outward_inventory table
CREATE TABLE outward_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES inventory_items(id) NOT NULL,
  quantity integer NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  purpose varchar(255) NOT NULL,
  taken_by varchar(255) NOT NULL,
  authorized_by varchar(255) NOT NULL,
  notes text,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_logs table
CREATE TABLE activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  type varchar(255) NOT NULL,
  description text NOT NULL,
  subject_id uuid,
  subject_type varchar(255),
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_role ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inward_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE outward_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage users"
ON users
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

-- Roles table policies
CREATE POLICY "Authenticated can view roles"
ON roles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage roles"
ON roles
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

-- Permissions table policies
CREATE POLICY "Authenticated can view permissions"
ON permissions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage permissions"
ON permissions
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

-- Case papers policies
CREATE POLICY "Authenticated can view case papers"
ON case_papers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can manage case papers"
ON case_papers
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name IN ('admin', 'doctor', 'staff')
  )
);

-- Feeding records policies
CREATE POLICY "Authenticated can view feeding records"
ON feeding_records
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can manage feeding records"
ON feeding_records
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name IN ('admin', 'doctor', 'staff')
  )
);

-- Cleaning records policies
CREATE POLICY "Authenticated can view cleaning records"
ON cleaning_records
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can manage cleaning records"
ON cleaning_records
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name IN ('admin', 'doctor', 'staff')
  )
);

-- Inventory items policies
CREATE POLICY "Authenticated can view inventory"
ON inventory_items
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can manage inventory"
ON inventory_items
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name IN ('admin', 'staff')
  )
);

-- Inward inventory policies
CREATE POLICY "Authenticated can view inward inventory"
ON inward_inventory
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can manage inward inventory"
ON inward_inventory
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name IN ('admin', 'staff')
  )
);

-- Outward inventory policies
CREATE POLICY "Authenticated can view outward inventory"
ON outward_inventory
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can manage outward inventory"
ON outward_inventory
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM role_user ru
    JOIN roles r ON r.id = ru.role_id
    WHERE ru.user_id = auth.uid()
    AND r.name IN ('admin', 'staff')
  )
);

-- Activity logs policies
CREATE POLICY "Authenticated can view activity logs"
ON activity_logs
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "System can create activity logs"
ON activity_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Role-user and permission-role junction table policies
CREATE POLICY "Admins can manage role assignments"
ON role_user
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

CREATE POLICY "Admins can manage permission assignments"
ON permission_role
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

-- Insert default roles
INSERT INTO roles (name) VALUES
('admin'),
('doctor'),
('staff');

-- Insert default permissions
INSERT INTO permissions (name) VALUES
('manage_users'),
('manage_roles'),
('manage_case_papers'),
('manage_feeding'),
('manage_cleaning'),
('manage_inventory'),
('view_reports'),
('manage_settings');