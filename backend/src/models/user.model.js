import { sql } from '../config/db.js';

export const UserModel = {
  async findByEmail(email) {
    const rows = await sql`
      SELECT id, name, email, password_hash, role, COALESCE(lessons_count, 0) as lessons_count, created_at 
      FROM users 
      WHERE email = ${email}
      LIMIT 1
    `;
    return rows[0] || null;
  },

  async findById(id) {
    const rows = await sql`
      SELECT id, name, email, role, COALESCE(lessons_count, 0) as lessons_count, created_at 
      FROM users 
      WHERE id = ${id}
      LIMIT 1
    `;
    return rows[0] || null;
  },

  async create({ name, email, passwordHash, role = 'student' }) {
    const rows = await sql`
      INSERT INTO users (name, email, password_hash, role, lessons_count)
      VALUES (${name}, ${email}, ${passwordHash}, ${role}, 0)
      RETURNING id, name, email, role, lessons_count, created_at
    `;
    return rows[0];
  },

  async updateLessons(id, lessonsCount) {
    const safeCount = Math.max(0, parseInt(lessonsCount, 10) || 0);
    const rows = await sql`
      UPDATE users 
      SET lessons_count = ${safeCount}
      WHERE id = ${id}
      RETURNING id, name, email, role, lessons_count, created_at
    `;
    return rows[0] || null;
  }
};
