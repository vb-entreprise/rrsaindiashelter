-- RRSA India NGO Database Structure
-- PostgreSQL version

-- ----------------------------------------------------------------------------
-- Users and permissions tables
-- ----------------------------------------------------------------------------

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    guard_name VARCHAR(255) NOT NULL DEFAULT 'web',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    guard_name VARCHAR(255) NOT NULL DEFAULT 'web',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_user (
    role_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (role_id, user_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE permission_role (
    permission_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (permission_id, role_id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- Case Papers table
-- ----------------------------------------------------------------------------

CREATE TYPE animal_type_enum AS ENUM ('dog', 'cat', 'bird', 'other');
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'unknown');
CREATE TYPE status_enum AS ENUM ('active', 'discharged', 'deceased');

CREATE TABLE case_papers (
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
    created_by INT,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- Feeding Records table
-- ----------------------------------------------------------------------------

CREATE TABLE feeding_records (
    id SERIAL PRIMARY KEY,
    case_paper_id INT NOT NULL,
    morning_value DECIMAL(10,2),
    evening_value DECIMAL(10,2),
    date DATE NOT NULL,
    time TIME NOT NULL,
    by_whom VARCHAR(255) NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_paper_id) REFERENCES case_papers(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- Cleaning Records table
-- ----------------------------------------------------------------------------

CREATE TABLE cleaning_records (
    id SERIAL PRIMARY KEY,
    area VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    by_whom VARCHAR(255) NOT NULL,
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- Inventory tables
-- ----------------------------------------------------------------------------

CREATE TYPE inventory_category_enum AS ENUM ('food', 'medicine', 'equipment', 'supplies', 'other');

CREATE TABLE inventory_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category inventory_category_enum NOT NULL,
    unit VARCHAR(50) NOT NULL,
    minimum_level INT,
    current_stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inward_inventory (
    id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    given_by VARCHAR(255) NOT NULL,
    received_by VARCHAR(255) NOT NULL,
    placed_at VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE outward_inventory (
    id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    taken_by VARCHAR(255) NOT NULL,
    authorized_by VARCHAR(255) NOT NULL,
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- Activity Log table
-- ----------------------------------------------------------------------------

CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    type VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    subject_id INT,
    subject_type VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- Insert default roles and permissions
-- ----------------------------------------------------------------------------

INSERT INTO roles (name) VALUES 
('admin'),
('doctor'),
('staff'),
('volunteer');

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
('delete-roles');

-- Assign permissions to admin role
INSERT INTO permission_role (permission_id, role_id)
SELECT p.id, r.id
FROM permissions p, roles r
WHERE r.name = 'admin';

-- Assign permissions to doctor role
INSERT INTO permission_role (permission_id, role_id)
SELECT p.id, r.id
FROM permissions p, roles r
WHERE r.name = 'doctor' AND p.name IN (
    'view-case-papers', 'create-case-papers', 'edit-case-papers',
    'view-feeding', 'create-feeding', 'edit-feeding',
    'view-cleaning', 'create-cleaning',
    'view-inventory'
);

-- Assign permissions to staff role
INSERT INTO permission_role (permission_id, role_id)
SELECT p.id, r.id
FROM permissions p, roles r
WHERE r.name = 'staff' AND p.name IN (
    'view-case-papers', 'create-case-papers',
    'view-feeding', 'create-feeding',
    'view-cleaning', 'create-cleaning',
    'view-inventory', 'create-inventory'
);

-- Assign permissions to volunteer role
INSERT INTO permission_role (permission_id, role_id)
SELECT p.id, r.id
FROM permissions p, roles r
WHERE r.name = 'volunteer' AND p.name IN (
    'view-case-papers',
    'view-feeding', 'create-feeding',
    'view-cleaning', 'create-cleaning'
);

-- Create default admin user (password is a bcrypt hash)
INSERT INTO users (name, email, password, phone) VALUES 
('Admin User', 'admin@rrsa.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543210');

-- Assign admin role to admin user
INSERT INTO role_user (role_id, user_id)
SELECT r.id, u.id
FROM roles r, users u
WHERE r.name = 'admin' AND u.email = 'admin@rrsa.org';

-- ----------------------------------------------------------------------------
-- Triggers for updated_at
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for all tables with updated_at
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER set_roles_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER set_permissions_updated_at
BEFORE UPDATE ON permissions
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER set_case_papers_updated_at
BEFORE UPDATE ON case_papers
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER set_feeding_records_updated_at
BEFORE UPDATE ON feeding_records
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER set_cleaning_records_updated_at
BEFORE UPDATE ON cleaning_records
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER set_inventory_items_updated_at
BEFORE UPDATE ON inventory_items
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER set_inward_inventory_updated_at
BEFORE UPDATE ON inward_inventory
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER set_outward_inventory_updated_at
BEFORE UPDATE ON outward_inventory
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();
