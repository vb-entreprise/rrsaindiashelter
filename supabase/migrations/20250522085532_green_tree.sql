/*
  # Add admin user and role assignment
  
  1. New Data
    - Creates an admin user with default credentials
    - Assigns admin role to the user
  
  2. Security
    - Password is hashed using bcrypt
    - User is linked to admin role via role_user table
  
  Note: In production, change the default password immediately!
*/

-- Insert admin user if not exists
INSERT INTO users (
  name,
  email,
  password,
  phone
)
SELECT 
  'Admin User',
  'admin@rrsa.com',
  -- Default password: Admin@123 (hashed)
  '$2a$10$5V6AJkh98KX5xHT2tHY1p.SqVK/H1.oqzd7JqxMGFTtF3GQx8WS4K',
  '1234567890'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@rrsa.com'
)
RETURNING id;

-- Assign admin role to the admin user
WITH admin_user AS (
  SELECT id FROM users WHERE email = 'admin@rrsa.com'
),
admin_role AS (
  SELECT id FROM roles WHERE name = 'admin'
)
INSERT INTO role_user (user_id, role_id)
SELECT admin_user.id, admin_role.id
FROM admin_user, admin_role
WHERE NOT EXISTS (
  SELECT 1 FROM role_user ru
  JOIN users u ON u.id = ru.user_id
  JOIN roles r ON r.id = ru.role_id
  WHERE u.email = 'admin@rrsa.com'
  AND r.name = 'admin'
);