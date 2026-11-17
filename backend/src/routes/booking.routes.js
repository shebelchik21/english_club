import { Router } from 'express';
import { 
  getMonthBookings, 
  getMyBookings, 
  createBooking, 
  cancelBooking 
} from '../controllers/booking.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/bookings?month=YYYY-MM
router.get('/', authenticateToken, getMonthBookings);

// GET /api/bookings/my
router.get('/my', authenticateToken, getMyBookings);

// POST /api/bookings
router.post('/', authenticateToken, createBooking);

// DELETE /api/bookings/:id
router.delete('/:id', authenticateToken, cancelBooking);

export default router;
