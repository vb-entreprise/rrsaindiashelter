import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
async function testDatabaseConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection successful!');
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); // Exit if database connection fails
    }
}

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Case Paper Routes
app.get('/api/case-papers', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM case_paper WHERE deleted_at IS NULL');
        res.json({ data: rows });
    } catch (error) {
        console.error('Error fetching case papers:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/case-papers', async (req, res) => {
    try {
        const {
            date, case_no, informer_name, aadhar, location, phone, alt_phone,
            by_whom, gender, age, type, animal_name, admited, history,
            admission_date, symptoms, treatment, remark
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO case_paper (
                date, case_no, informer_name, aadhar, location, phone, alt_phone,
                by_whom, gender, age, type, animal_name, admited, history,
                admission_date, symptoms, treatment, remark
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [date, case_no, informer_name, aadhar, location, phone, alt_phone,
             by_whom, gender, age, type, animal_name, admited, history,
             admission_date, symptoms, treatment, remark]
        );

        res.status(201).json({ id: result.insertId, message: 'Case paper created successfully' });
    } catch (error) {
        console.error('Error creating case paper:', error);
        res.status(500).json({ error: error.message });
    }
});

// Cleaning Routes
app.get('/api/cleaning', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cleaning');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching cleaning records:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/cleaning', async (req, res) => {
    try {
        const { space, clean, by_whom, scale, datetime, remark } = req.body;
        const [result] = await pool.query(
            'INSERT INTO cleaning (space, clean, by_whom, scale, datetime, remark) VALUES (?, ?, ?, ?, ?, ?)',
            [space, clean, by_whom, scale, datetime, remark]
        );
        res.status(201).json({ id: result.insertId, message: 'Cleaning record created successfully' });
    } catch (error) {
        console.error('Error creating cleaning record:', error);
        res.status(500).json({ error: error.message });
    }
});

// Feeding Routes
app.get('/api/feeding', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM feeding');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching feeding records:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/feeding', async (req, res) => {
    try {
        const {
            day, datetime, morning_menu, morning_value,
            evening_menu, evening_value, given_food, by_whom, remark
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO feeding (
                day, datetime, morning_menu, morning_value,
                evening_menu, evening_value, given_food, by_whom, remark
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [day, datetime, morning_menu, morning_value,
             evening_menu, evening_value, given_food, by_whom, remark]
        );

        res.status(201).json({ id: result.insertId, message: 'Feeding record created successfully' });
    } catch (error) {
        console.error('Error creating feeding record:', error);
        res.status(500).json({ error: error.message });
    }
});

// Menu Routes
app.get('/api/menu', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM menu');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: error.message });
    }
});

// User Routes
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                u.id, u.name, u.email, u.phone, u.user_type,
                r.name AS role
            FROM users u
            LEFT JOIN model_has_roles mhr ON mhr.model_id = u.id AND mhr.model_type = 'App\\Models\\User'
            LEFT JOIN roles r ON r.id = mhr.role_id
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT 
                u.id, u.name, u.email, u.phone, u.user_type,
                r.name AS role
            FROM users u
            LEFT JOIN model_has_roles mhr ON mhr.model_id = u.id AND mhr.model_type = 'App\\Models\\User'
            LEFT JOIN roles r ON r.id = mhr.role_id
            WHERE u.id = ?
        `, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ data: rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { name, email, password, phone, user_type = 'user' } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }
        // Insert user
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, phone, user_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
            [name, email, password, phone, user_type]
        );
        const userId = result.insertId;
        // Assign default role if none exists
        const [roles] = await pool.query('SELECT id FROM roles WHERE name = ?', ['User']);
        if (roles.length > 0) {
            await pool.query('INSERT INTO model_has_roles (role_id, model_type, model_id) VALUES (?, ?, ?)', [roles[0].id, 'App\\Models\\User', userId]);
        }
        res.status(201).json({ id: userId, message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, user_type } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE users SET name = ?, email = ?, phone = ?, user_type = ?, updated_at = NOW() WHERE id = ?',
            [name, email, phone, user_type, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/users/:id/role', async (req, res) => {
    const { id } = req.params;
    const { role_id } = req.body;
    if (!role_id) {
        return res.status(400).json({ error: 'role_id is required' });
    }
    try {
        // Remove existing roles for this user
        await pool.query('DELETE FROM model_has_roles WHERE model_id = ? AND model_type = ?', [id, 'App\\Models\\User']);
        // Assign new role
        await pool.query('INSERT INTO model_has_roles (role_id, model_type, model_id) VALUES (?, ?, ?)', [role_id, 'App\\Models\\User', id]);
        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Roles Routes
app.get('/api/roles', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM roles');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/roles', async (req, res) => {
    try {
        const { name, guard_name = 'web' } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Role name is required' });
        }
        const [result] = await pool.query(
            'INSERT INTO roles (name, guard_name, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
            [name, guard_name]
        );
        res.status(201).json({ id: result.insertId, message: 'Role created successfully' });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ error: error.message });
    }
});

// Permissions Routes
app.get('/api/permissions', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM permissions');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get permissions for a role
app.get('/api/roles/:id/permissions', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(
            `SELECT p.* FROM permissions p
             JOIN role_has_permissions rp ON rp.permission_id = p.id
             WHERE rp.role_id = ?`,
            [id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching role permissions:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update permissions for a role
app.put('/api/roles/:id/permissions', async (req, res) => {
    const { id } = req.params;
    const { permission_ids } = req.body;
    if (!Array.isArray(permission_ids)) {
        return res.status(400).json({ error: 'permission_ids must be an array' });
    }
    try {
        // Remove existing permissions
        await pool.query('DELETE FROM role_has_permissions WHERE role_id = ?', [id]);
        // Assign new permissions
        for (const pid of permission_ids) {
            await pool.query('INSERT INTO role_has_permissions (permission_id, role_id) VALUES (?, ?)', [pid, id]);
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating role permissions:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await testDatabaseConnection();
});