import { sql } from '../config/db.js';
import { UserModel } from '../models/user.model.js';

export const getStudents = async (req, res, next) => {
  try {
    const students = await sql`
      SELECT id, name, email, role, COALESCE(lessons_count, 0) as lessons_count, created_at 
      FROM users 
      WHERE role != 'admin'
      ORDER BY created_at DESC
    `;
    res.status(200).json({ students });
  } catch (error) {
    next(error);
  }
};

export const updateStudentLessons = async (req, res, next) => {
  try {
    const studentId = parseInt(req.params.id, 10);
    const { count, delta } = req.body;

    const student = await UserModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    let currentLessons = Math.max(0, student.lessons_count || 0);
    let newLessonsCount;

    if (delta !== undefined) {
      const deltaNum = parseInt(delta, 10);
      if (isNaN(deltaNum)) {
        return res.status(400).json({ message: 'Invalid delta value. Must be an integer.' });
      }
      newLessonsCount = Math.max(0, currentLessons + deltaNum);
    } else if (count !== undefined) {
      const countNum = parseInt(count, 10);
      if (isNaN(countNum)) {
        return res.status(400).json({ message: 'Invalid count value. Must be an integer.' });
      }
      newLessonsCount = Math.max(0, countNum);
    } else {
      return res.status(400).json({ message: 'Please provide either delta or count.' });
    }

    // Strict non-negative guarantee: balance cannot be negative
    newLessonsCount = Math.max(0, newLessonsCount);

    const updated = await UserModel.updateLessons(studentId, newLessonsCount);

    res.status(200).json({
      message: 'Student lessons balance updated successfully.',
      student: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        lessonsCount: Math.max(0, updated.lessons_count || 0)
      }
    });
  } catch (error) {
    next(error);
  }
};
