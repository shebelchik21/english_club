import { sql } from '../config/db.js';

export const getStudents = async (req, res, next) => {
  try {
    const students = await sql`
      SELECT id, name, email, role, created_at 
      FROM users 
      WHERE role != 'admin'
      ORDER BY created_at DESC
    `;
    res.status(200).json({ students });
  } catch (error) {
    next(error);
  }
};
