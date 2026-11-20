import { sql } from '../config/db.js';

export const BlockedSlotModel = {
  async findByMonth(year, month) {
    const rows = await sql`
      SELECT 
        b.id,
        to_char(b.booking_date, 'YYYY-MM-DD') as booking_date,
        b.time_slot,
        b.reason,
        b.created_by,
        b.created_at,
        u.name as creator_name
      FROM blocked_slots b
      LEFT JOIN users u ON b.created_by = u.id
      WHERE EXTRACT(YEAR FROM b.booking_date) = ${year}
        AND EXTRACT(MONTH FROM b.booking_date) = ${month}
      ORDER BY b.booking_date ASC, b.time_slot ASC
    `;
    return rows;
  },

  async isSlotBlocked(bookingDate, timeSlot) {
    const rows = await sql`
      SELECT id, reason FROM blocked_slots
      WHERE booking_date = ${bookingDate}::date
        AND time_slot = ${timeSlot}
      LIMIT 1
    `;
    return rows[0] || null;
  },

  async findById(id) {
    const rows = await sql`
      SELECT 
        id,
        to_char(booking_date, 'YYYY-MM-DD') as booking_date,
        time_slot,
        reason,
        created_by,
        created_at
      FROM blocked_slots
      WHERE id = ${id}
      LIMIT 1
    `;
    return rows[0] || null;
  },

  async create({ bookingDate, timeSlot, reason, createdBy }) {
    const rows = await sql`
      INSERT INTO blocked_slots (booking_date, time_slot, reason, created_by)
      VALUES (${bookingDate}::date, ${timeSlot}, ${reason || null}, ${createdBy || null})
      RETURNING 
        id, 
        to_char(booking_date, 'YYYY-MM-DD') as booking_date, 
        time_slot, 
        reason, 
        created_by, 
        created_at
    `;
    return rows[0];
  },

  async delete(id) {
    const rows = await sql`
      DELETE FROM blocked_slots
      WHERE id = ${id}
      RETURNING id, to_char(booking_date, 'YYYY-MM-DD') as booking_date, time_slot
    `;
    return rows[0] || null;
  },

  async deleteBySlot(bookingDate, timeSlot) {
    const rows = await sql`
      DELETE FROM blocked_slots
      WHERE booking_date = ${bookingDate}::date
        AND time_slot = ${timeSlot}
      RETURNING id, to_char(booking_date, 'YYYY-MM-DD') as booking_date, time_slot
    `;
    return rows[0] || null;
  }
};
