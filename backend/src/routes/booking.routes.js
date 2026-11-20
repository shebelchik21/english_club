import { Router } from 'express';
import { 
  getMonthBookings, 
  getMyBookings, 
  getUpcomingBookings,
  createBooking, 
  cancelBooking,
  blockSlot,
  unblockSlot
} from '../controllers/booking.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/bookings/upcoming
router.get('/upcoming', authenticateToken, getUpcomingBookings);

// GET /api/bookings?month=YYYY-MM
router.get('/', authenticateToken, getMonthBookings);

// GET /api/bookings/my
router.get('/my', authenticateToken, getMyBookings);

// POST /api/bookings
router.post('/', authenticateToken, createBooking);

// POST /api/bookings/block (admin only)
router.post('/block', authenticateToken, blockSlot);

// POST /api/bookings/unblock (admin only)
router.post('/unblock', authenticateToken, unblockSlot);

// DELETE /api/bookings/block/:id (admin only)
router.delete('/block/:id', authenticateToken, unblockSlot);

// DELETE /api/bookings/:id
router.delete('/:id', authenticateToken, cancelBooking);

export default router;
