import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
    try {
        console.log('Attempting to connect to database...');
        console.log('Connection details:', {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log('Successfully connected to database!');

        // Test query to list all tables
        const [tables] = await connection.query('SHOW TABLES');
        console.log('\nAvailable tables:');
        tables.forEach(table => {
            console.log(`- ${Object.values(table)[0]}`);
        });

        // Test query to count records in each table
        console.log('\nRecord counts:');
        for (const table of tables) {
            const tableName = Object.values(table)[0];
            const [count] = await connection.query(`SELECT COUNT(*) as count FROM ${tableName}`);
            console.log(`${tableName}: ${count[0].count} records`);
        }

        await connection.end();
        console.log('\nConnection closed successfully.');

    } catch (error) {
        console.error('Error connecting to database:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('\nCould not connect to the database. Please check:');
            console.error('1. Is XAMPP running?');
            console.error('2. Is MySQL service started?');
            console.error('3. Are the database credentials correct?');
        }
    }
}

testConnection(); 