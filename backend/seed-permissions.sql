INSERT INTO permissions (name, guard_name, created_at, updated_at) VALUES
-- Home
('dashboard.data', 'web', NOW(), NOW()),
-- Case Paper
('casepaper.view', 'web', NOW(), NOW()),
('casepaper.add', 'web', NOW(), NOW()),
('casepaper.edit', 'web', NOW(), NOW()),
('casepaper.delete', 'web', NOW(), NOW()),
-- Roles
('roles.view', 'web', NOW(), NOW()),
('roles.add', 'web', NOW(), NOW()),
('roles.edit', 'web', NOW(), NOW()),
('roles.delete', 'web', NOW(), NOW()),
-- User
('user.view', 'web', NOW(), NOW()),
('user.add', 'web', NOW(), NOW()),
('user.edit', 'web', NOW(), NOW()),
('user.delete', 'web', NOW(), NOW()),
-- Cleaning
('cleaning.view', 'web', NOW(), NOW()),
('cleaning.add', 'web', NOW(), NOW()),
('cleaning.edit', 'web', NOW(), NOW()),
('cleaning.delete', 'web', NOW(), NOW()),
-- Feeding
('feeding.view', 'web', NOW(), NOW()),
('feeding.add', 'web', NOW(), NOW()),
('feeding.edit', 'web', NOW(), NOW()),
('feeding.delete', 'web', NOW(), NOW()),
-- Media
('media.view', 'web', NOW(), NOW()),
('media.add', 'web', NOW(), NOW()),
('media.edit', 'web', NOW(), NOW()),
('media.delete', 'web', NOW(), NOW()),
-- Release
('release.view', 'web', NOW(), NOW()),
('release.add', 'web', NOW(), NOW()),
('release.edit', 'web', NOW(), NOW()),
('release.delete', 'web', NOW(), NOW()),
-- Inward
('inward.view', 'web', NOW(), NOW()),
('inward.add', 'web', NOW(), NOW()),
('inward.edit', 'web', NOW(), NOW()),
('inward.delete', 'web', NOW(), NOW()),
-- Outward
('outward.view', 'web', NOW(), NOW()),
('outward.add', 'web', NOW(), NOW()),
('outward.edit', 'web', NOW(), NOW()),
('outward.delete', 'web', NOW(), NOW()); 