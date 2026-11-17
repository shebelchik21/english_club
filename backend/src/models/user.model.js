import { sql } from '../config/db.js';

export const UserModel = {
  async findByEmail(email) {
    const rows = await sql`
      SELECT id, name, email, password_hash, role, created_at 
      FROM users 
      WHERE email = ${email}
      LIMIT 1
    `;
    return rows[0] || null;
  },

  async findById(id) {
    const rows = await sql`
      SELECT id, name, email, role, created_at 
      FROM users 
      WHERE id = ${id}
      LIMIT 1
    `;
    return rows[0] || null;
  },

  async create({ name, email, passwordHash, role = 'student' }) {
    const rows = await sql`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (${name}, ${email}, ${passwordHash}, ${role})
      RETURNING id, name, email, role, created_at
    `;
    return rows[0];
  }
};
