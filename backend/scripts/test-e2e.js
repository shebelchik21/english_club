import app from '../src/app.js';
import { connectDB, sql } from '../src/config/db.js';

async function runE2ETest() {
  console.log('=== Starting End-to-End Server & Database Test ===');
  await connectDB();

  const server = app.listen(5001, async () => {
    console.log('Test server running on port 5001');

    try {
      const baseUrl = 'http://localhost:5001';

      // 1. Health check
      const healthRes = await fetch(`${baseUrl}/health`);
      const healthData = await healthRes.json();
      console.log('✓ [GET /health]:', healthData.status);

      // 2. Database Status
      const dbStatusRes = await fetch(`${baseUrl}/api/db-status`);
      const dbStatus = await dbStatusRes.json();
      console.log('✓ [GET /api/db-status]:', {
        status: dbStatus.status,
        database: dbStatus.database,
        branch: dbStatus.branch,
        usersCount: dbStatus.usersCount
      });

      // 3. User Registration
      const testEmail = `student_${Date.now()}@englishclub.com`;
      const regRes = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Alex Johnson',
          email: testEmail,
          password: 'securePassword123'
        })
      });
      const regData = await regRes.json();
      console.log('✓ [POST /api/auth/register]:', regData.message, `User ID: ${regData.user.id}`);
      const token = regData.token;

      // 4. User Login
      const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'securePassword123'
        })
      });
      const loginData = await loginRes.json();
      console.log('✓ [POST /api/auth/login]:', loginData.message);

      // 5. Get Current User (/api/auth/me) with JWT
      const meRes = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const meData = await meRes.json();
      console.log('✓ [GET /api/auth/me]:', `Authorized as ${meData.user.name} (${meData.user.email}) [Role: ${meData.user.role}]`);

      // Clean up test user
      await sql`DELETE FROM users WHERE email = ${testEmail}`;
      console.log(`✓ Cleaned up test user ${testEmail} from Neon database`);

      console.log('=== END-TO-END TEST COMPLETED SUCCESSFULLY ===');
      server.close(() => process.exit(0));
    } catch (err) {
      console.error('✕ E2E Test failed:', err);
      server.close(() => process.exit(1));
    }
  });
}

runE2ETest();
