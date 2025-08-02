import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../database/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  try {
    console.log('🗄️  Initializing database...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('✅ Database schema created successfully!');
    console.log('📋 Tables created:');
    console.log('   - users');
    console.log('   - expenses');
    console.log('   - partial_payments');
    console.log('   - indexes and triggers');
    
    // Test the connection
    const result = await pool.query('SELECT NOW()');
    console.log('🔗 Database connection test successful:', result.rows[0].now);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the initialization
initializeDatabase(); 