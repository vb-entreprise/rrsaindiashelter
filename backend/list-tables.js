import { pool } from './db.js';

async function listTables() {
  try {
    console.log('Connecting to database...');
    
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('Connected successfully!\n');

    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('Database Tables:');
    console.log('----------------');
    result.rows.forEach(row => {
      console.log(row.table_name);
    });
    
    // Get table details
    for (const row of result.rows) {
      const tableName = row.table_name;
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `, [tableName]);
      
      console.log(`\nTable: ${tableName}`);
      console.log('Columns:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}, ${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    }
  } catch (err) {
    console.error('Error:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('\nCould not connect to the database. Please check:');
      console.error('1. Is PostgreSQL running?');
      console.error('2. Are the database credentials correct?');
      console.error('3. Is the database server running on the correct port?');
    }
  } finally {
    await pool.end();
  }
}

listTables(); 