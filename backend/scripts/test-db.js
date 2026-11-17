import { connectDB, sql } from '../src/config/db.js';

async function runTest() {
  console.log('--- Starting Neon Postgres End-to-End Test ---');
  try {
    // 1. Test connection
    await connectDB();

    // 2. Query Postgres version & database name
    const [info] = await sql`SELECT version(), current_database(), current_user`;
    console.log(`Database: ${info.current_database}`);
    console.log(`User: ${info.current_user}`);
    console.log(`PostgreSQL Version: ${info.version}`);

    // 3. Test users table existence and query
    const [countResult] = await sql`SELECT count(*)::int as total FROM users`;
    console.log(`Total registered users in Neon DB: ${countResult.total}`);

    // 4. Test insert and select transaction/flow
    const testEmail = `test_${Date.now()}@example.com`;
    const [inserted] = await sql`
      INSERT INTO users (name, email, password_hash, role)
      VALUES ('Neon Tester', ${testEmail}, 'hash_test_123', 'tester')
      RETURNING id, name, email, role, created_at
    `;
    console.log(`✓ Inserted test user ID: ${inserted.id} (${inserted.email})`);

    const [retrieved] = await sql`
      SELECT id, name, email, role FROM users WHERE id = ${inserted.id}
    `;
    console.log(`✓ Retrieved user successfully: ${retrieved.name} [${retrieved.role}]`);

    // Clean up test record
    await sql`DELETE FROM users WHERE id = ${inserted.id}`;
    console.log(`✓ Cleaned up test user ID: ${inserted.id}`);

    console.log('--- ALL NEON POSTGRES TESTS PASSED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('✕ Test failed with error:', error);
    process.exit(1);
  }
}

runTest();
