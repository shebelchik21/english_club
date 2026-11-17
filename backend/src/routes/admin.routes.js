import { Router } from 'express';
import { getStudents } from '../controllers/admin.controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/admin/students
router.get('/students', authenticateToken, requireAdmin, getStudents);

export default router;
