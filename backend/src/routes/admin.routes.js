import { Router } from 'express';
import { getStudents, updateStudentLessons } from '../controllers/admin.controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/admin/students
router.get('/students', authenticateToken, requireAdmin, getStudents);

// PATCH /api/admin/students/:id/lessons
router.patch('/students/:id/lessons', authenticateToken, requireAdmin, updateStudentLessons);

export default router;
