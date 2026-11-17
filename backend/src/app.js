import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { sql, initDB } from './config/db.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

app.use(express.json());

// Ensure database table exists on serverless cold starts
app.use(async (req, res, next) => {
  try {
    await initDB();
  } catch (err) {
    console.error('Init DB error:', err);
  }
  next();
});

// API routes
app.use('/api', routes);

// Database status & Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/db-status', async (req, res) => {
  try {
    const rows = await sql`SELECT version(), current_database(), current_user`;
    const userCountResult = await sql`SELECT count(*) FROM users`;
    res.json({
      status: 'connected',
      database: rows[0].current_database,
      dbUser: rows[0].current_user,
      version: rows[0].version,
      usersCount: parseInt(userCountResult[0].count, 10),
      branch: process.env.NEON_BRANCH || 'production'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
