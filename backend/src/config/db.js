import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env files in order of priority (for local development)
dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️ WARNING: DATABASE_URL is not set in environment!');
}

export const sql = neon(connectionString);

let schemaInitialized = false;

export const initDB = async () => {
  if (schemaInitialized) return;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'student',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  schemaInitialized = true;
  console.log('✓ Database schema (users table) verified.');
};

export const connectDB = async () => {
  try {
    const [result] = await sql`SELECT version(), current_database()`;
    console.log(`✓ Connected to Neon Postgres [${result.current_database}]: ${result.version}`);
    await initDB();
  } catch (error) {
    console.error('✕ Failed to connect to Neon Postgres:', error);
    throw error;
  }
};
