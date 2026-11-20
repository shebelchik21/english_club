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
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'student',
        lessons_count INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS lessons_count INT DEFAULT 0`;
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        booking_date DATE NOT NULL,
        time_slot VARCHAR(10) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_booking_slot UNIQUE (booking_date, time_slot)
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (booking_date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings (user_id)`;
    await sql`
      CREATE TABLE IF NOT EXISTS blocked_slots (
        id SERIAL PRIMARY KEY,
        booking_date DATE NOT NULL,
        time_slot VARCHAR(10) NOT NULL,
        reason VARCHAR(255),
        created_by INT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_blocked_slot UNIQUE (booking_date, time_slot)
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON blocked_slots (booking_date)`;
    schemaInitialized = true;
    console.log('✓ Database schema (users, bookings & blocked_slots tables) verified.');
  } catch (err) {
    console.error('Database schema initialization error:', err);
  }
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
