import { BookingModel } from '../models/booking.model.js';
import { UserModel } from '../models/user.model.js';
import { sql } from '../config/db.js';

const ALLOWED_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const getMonthBookings = async (req, res, next) => {
  try {
    const { month } = req.query; // format 'YYYY-MM'
    let year, monthNum;

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const parts = month.split('-');
      year = parseInt(parts[0], 10);
      monthNum = parseInt(parts[1], 10);
    } else {
      const now = new Date();
      year = now.getFullYear();
      monthNum = now.getMonth() + 1;
    }

    const bookings = await BookingModel.findByMonth(year, monthNum);
    const isAdmin = req.user.role === 'admin';

    // Format response based on user role
    const formatted = bookings.map(b => {
      const isMine = b.user_id === req.user.id;
      if (isAdmin) {
        return {
          id: b.id,
          userId: b.user_id,
          studentName: b.user_name,
          studentEmail: b.user_email,
          bookingDate: b.booking_date,
          timeSlot: b.time_slot,
          isMine: isMine,
          isBooked: true
        };
      } else {
        return {
          id: isMine ? b.id : null,
          bookingDate: b.booking_date,
          timeSlot: b.time_slot,
          isMine: isMine,
          isBooked: true
        };
      }
    });

    res.status(200).json({ bookings: formatted });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await BookingModel.findByUser(req.user.id);
    res.status(200).json({ bookings });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingBookings = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const isAdmin = req.user.role === 'admin';

    if (isAdmin) {
      const bookings = await BookingModel.findUpcoming(startDate, endDate);
      const formatted = bookings.map(b => ({
        id: b.id,
        userId: b.user_id,
        studentName: b.user_name,
        studentEmail: b.user_email,
        bookingDate: b.booking_date,
        timeSlot: b.time_slot,
        isMine: b.user_id === req.user.id,
        isBooked: true
      }));
      return res.status(200).json({ bookings: formatted });
    } else {
      const bookings = await BookingModel.findUpcomingByUser(req.user.id, startDate, endDate);
      const formatted = bookings.map(b => ({
        id: b.id,
        bookingDate: b.booking_date,
        timeSlot: b.time_slot,
        isMine: true,
        isBooked: true
      }));
      return res.status(200).json({ bookings: formatted });
    }
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { bookingDate, timeSlot } = req.body;

    if (!bookingDate || !timeSlot) {
      return res.status(400).json({ message: 'Date and time slot are required.' });
    }

    if (!ALLOWED_SLOTS.includes(timeSlot)) {
      return res.status(400).json({ 
        message: `Invalid time slot. Allowed slots are between 09:00 and 18:00.` 
      });
    }

    // Check user balance
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if ((user.lessons_count || 0) < 1) {
      return res.status(403).json({ 
        message: 'Insufficient lessons balance. Please contact the administrator to get lessons.' 
      });
    }

    // Check if slot is already booked
    const isBooked = await BookingModel.isSlotBooked(bookingDate, timeSlot);
    if (isBooked) {
      return res.status(409).json({ 
        message: 'This time slot is already booked by another student. Please choose a different time.' 
      });
    }

    // Create booking and deduct 1 lesson
    const booking = await BookingModel.create({
      userId: req.user.id,
      bookingDate,
      timeSlot
    });

    const newBalance = Math.max(0, (user.lessons_count || 0) - 1);
    await UserModel.updateLessons(req.user.id, newBalance);

    res.status(201).json({
      message: 'Lesson booked successfully!',
      booking: {
        id: booking.id,
        bookingDate: booking.booking_date,
        timeSlot: booking.time_slot,
        isMine: true
      },
      remainingLessons: newBalance
    });
  } catch (error) {
    // Catch PostgreSQL unique constraint violation
    if (error.code === '23505') {
      return res.status(409).json({ 
        message: 'This slot was just booked by another student. Please select another slot.' 
      });
    }
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const bookingId = parseInt(req.params.id, 10);
    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = booking.user_id === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Access denied: You can only cancel your own bookings.' });
    }

    // Delete booking
    await BookingModel.delete(bookingId);

    // Refund 1 lesson credit to student
    const student = await UserModel.findById(booking.user_id);
    if (student) {
      const newBalance = (student.lessons_count || 0) + 1;
      await UserModel.updateLessons(booking.user_id, newBalance);
    }

    res.status(200).json({
      message: 'Lesson booking cancelled successfully. 1 lesson has been refunded.',
      cancelledBookingId: bookingId
    });
  } catch (error) {
    next(error);
  }
};
