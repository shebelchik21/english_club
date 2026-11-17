import { sql } from '../config/db.js';

export const BookingModel = {
  async findByMonth(year, month) {
    const rows = await sql`
      SELECT 
        b.id,
        b.user_id,
        to_char(b.booking_date, 'YYYY-MM-DD') as booking_date,
        b.time_slot,
        b.created_at,
        u.name as user_name,
        u.email as user_email
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE EXTRACT(YEAR FROM b.booking_date) = ${year}
        AND EXTRACT(MONTH FROM b.booking_date) = ${month}
      ORDER BY b.booking_date ASC, b.time_slot ASC
    `;
    return rows;
  },

  async findByUser(userId) {
    const rows = await sql`
      SELECT 
        b.id,
        b.user_id,
        to_char(b.booking_date, 'YYYY-MM-DD') as booking_date,
        b.time_slot,
        b.created_at
      FROM bookings b
      WHERE b.user_id = ${userId}
      ORDER BY b.booking_date ASC, b.time_slot ASC
    `;
    return rows;
  },

  async findById(id) {
    const rows = await sql`
      SELECT 
        b.id,
        b.user_id,
        to_char(b.booking_date, 'YYYY-MM-DD') as booking_date,
        b.time_slot,
        b.created_at,
        u.name as user_name,
        u.email as user_email
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.id = ${id}
      LIMIT 1
    `;
    return rows[0] || null;
  },

  async isSlotBooked(bookingDate, timeSlot) {
    const rows = await sql`
      SELECT id FROM bookings
      WHERE booking_date = ${bookingDate}::date
        AND time_slot = ${timeSlot}
      LIMIT 1
    `;
    return rows.length > 0;
  },

  async create({ userId, bookingDate, timeSlot }) {
    const rows = await sql`
      INSERT INTO bookings (user_id, booking_date, time_slot)
      VALUES (${userId}, ${bookingDate}::date, ${timeSlot})
      RETURNING 
        id, 
        user_id, 
        to_char(booking_date, 'YYYY-MM-DD') as booking_date, 
        time_slot, 
        created_at
    `;
    return rows[0];
  },

  async delete(id) {
    const rows = await sql`
      DELETE FROM bookings
      WHERE id = ${id}
      RETURNING id, user_id, to_char(booking_date, 'YYYY-MM-DD') as booking_date, time_slot
    `;
    return rows[0] || null;
  }
};
