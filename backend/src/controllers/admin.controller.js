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

    let newLessonsCount = student.lessons_count || 0;

    if (count !== undefined) {
      newLessonsCount = Math.max(0, parseInt(count, 10) || 0);
    } else if (delta !== undefined) {
      newLessonsCount = Math.max(0, newLessonsCount + (parseInt(delta, 10) || 0));
    } else {
      return res.status(400).json({ message: 'Please provide either count or delta.' });
    }

    const updated = await UserModel.updateLessons(studentId, newLessonsCount);

    res.status(200).json({
      message: 'Student lessons balance updated successfully.',
      student: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        lessonsCount: updated.lessons_count
      }
    });
  } catch (error) {
    next(error);
  }
};
