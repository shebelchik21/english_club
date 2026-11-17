import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../services/api.js';

const SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const CalendarPage = ({ setCurrentPage }) => {
  const { user, token, refreshUser } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const isAdmin = user?.role === 'admin';
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const pad = (n) => String(n).padStart(2, '0');
  const currentMonthStr = `${year}-${pad(month + 1)}`;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(`/bookings?month=${currentMonthStr}`, 'GET', null, token);
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchBookings();
    }
  }, [currentMonthStr, token]);

  if (!user) {
    return (
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <h2>Please Sign In</h2>
          <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>
            Sign in to view the English Club calendar and schedule.
          </p>
          <button className="btn btn-blue" onClick={() => setCurrentPage('login')}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
    setFeedback({ type: '', text: '' });
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
    setFeedback({ type: '', text: '' });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(today.getDate());
    setFeedback({ type: '', text: '' });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const startOffset = (firstDayIndex + 6) % 7;

  const days = [];
  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  // Selected date formatted as YYYY-MM-DD
  const selectedDateStr = selectedDay ? `${year}-${pad(month + 1)}-${pad(selectedDay)}` : null;

  // Bookings for the currently selected day
  const dayBookings = bookings.filter(b => b.bookingDate === selectedDateStr);

  const handleBookSlot = async (timeSlot) => {
    setActionLoading(true);
    setFeedback({ type: '', text: '' });

    try {
      const res = await apiRequest('/bookings', 'POST', {
        bookingDate: selectedDateStr,
        timeSlot
      }, token);

      setFeedback({ type: 'success', text: `Session at ${timeSlot} successfully booked! 1 lesson credit deducted.` });
      await fetchBookings();
      if (refreshUser) await refreshUser();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to book session.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSlot = async (bookingId, timeSlot) => {
    if (!window.confirm(`Are you sure you want to cancel the session at ${timeSlot}? 1 lesson credit will be refunded.`)) {
      return;
    }

    setActionLoading(true);
    setFeedback({ type: '', text: '' });

    try {
      await apiRequest(`/bookings/${bookingId}`, 'DELETE', null, token);
      setFeedback({ type: 'success', text: `Session at ${timeSlot} cancelled. 1 lesson credit refunded.` });
      await fetchBookings();
      if (refreshUser) await refreshUser();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to cancel session.' });
    } finally {
      setActionLoading(false);
    }
  };

  const lessonsBalance = user.lessonsCount !== undefined ? user.lessonsCount : 0;

  return (
    <div className="container" style={{ maxWidth: '920px' }}>
      <div className="card">
        {/* Header Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📅</span>
              <span>{monthNames[month]} {year}</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              {isAdmin 
                ? 'Admin Calendar: Monitor bookings and schedule lessons' 
                : `Student Calendar: You have ${lessonsBalance} lesson ${lessonsBalance === 1 ? 'credit' : 'credits'} remaining`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button 
              className="btn" 
              style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '0.5rem 1rem' }} 
              onClick={prevMonth}
            >
              ← Prev
            </button>
            <button 
              className="btn btn-blue" 
              style={{ padding: '0.5rem 1rem' }} 
              onClick={goToToday}
            >
              Today
            </button>
            <button 
              className="btn" 
              style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '0.5rem 1rem' }} 
              onClick={nextMonth}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          {daysOfWeek.map((dayName, idx) => (
            <div key={dayName} style={{ padding: '0.5rem', fontSize: '0.9rem', color: idx >= 5 ? '#ef4444' : 'inherit' }}>
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} style={{ minHeight: '85px', background: '#fafafa', borderRadius: '8px' }} />;
            }

            const isToday = (
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear()
            );

            const isSelected = selectedDay === day;
            const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;

            // Check bookings on this day
            const bookingsOnDay = bookings.filter(b => b.bookingDate === dateStr);
            const myBookingsOnDay = bookingsOnDay.filter(b => b.isMine);
            const hasMyBooking = myBookingsOnDay.length > 0;

            return (
              <div 
                key={day}
                onClick={() => {
                  setSelectedDay(day);
                  setFeedback({ type: '', text: '' });
                }}
                style={{
                  minHeight: '85px',
                  padding: '0.6rem',
                  borderRadius: '8px',
                  border: isSelected 
                    ? '2px solid #2563eb' 
                    : isToday 
                    ? '2px solid #93c5fd' 
                    : '1px solid #e2e8f0',
                  backgroundColor: isSelected 
                    ? '#eff6ff' 
                    : isToday 
                    ? '#f8fafc' 
                    : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 0 2px rgba(37, 99, 235, 0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontWeight: isSelected || isToday ? 700 : 500,
                    fontSize: '1rem',
                    color: isSelected ? '#1d4ed8' : isToday ? '#2563eb' : '#1e293b'
                  }}>
                    {day}
                  </span>
                  {isToday && (
                    <span style={{ 
                      fontSize: '0.65rem', 
                      backgroundColor: '#2563eb', 
                      color: '#ffffff', 
                      padding: '0.1rem 0.35rem', 
                      borderRadius: '4px',
                      fontWeight: 600
                    }}>
                      TODAY
                    </span>
                  )}
                </div>

                {/* Dot / Indicator for booked lessons */}
                <div style={{ marginTop: '0.4rem' }}>
                  {hasMyBooking && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem',
                      fontSize: '0.72rem', 
                      color: '#15803d', 
                      fontWeight: 600,
                      backgroundColor: '#dcfce7',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px'
                    }}>
                      <span style={{ width: '6px', height: '6px', backgroundColor: '#16a34a', borderRadius: '50%' }}></span>
                      <span>Lesson</span>
                    </div>
                  )}

                  {isAdmin && bookingsOnDay.length > 0 && !hasMyBooking && (
                    <div style={{ 
                      fontSize: '0.72rem', 
                      color: '#4338ca', 
                      fontWeight: 600,
                      backgroundColor: '#e0e7ff',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px'
                    }}>
                      ● {bookingsOnDay.length} {bookingsOnDay.length === 1 ? 'booked' : 'booked'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Date Session Slots */}
        {selectedDay && (
          <div style={{ 
            borderTop: '2px solid var(--border-color)', 
            paddingTop: '1.5rem',
            marginTop: '1rem' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>
                  Sessions for {monthNames[month]} {selectedDay}, {year}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Hourly slots from 09:00 to 18:00
                </p>
              </div>

              {!isAdmin && (
                <div style={{ 
                  backgroundColor: lessonsBalance > 0 ? '#dcfce7' : '#fee2e2', 
                  color: lessonsBalance > 0 ? '#15803d' : '#b91c1c', 
                  padding: '0.35rem 0.75rem', 
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}>
                  {lessonsBalance > 0 ? `${lessonsBalance} credits available` : '0 credits (Top-up required)'}
                </div>
              )}
            </div>

            {feedback.text && (
              <div style={{
                padding: '0.75rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                backgroundColor: feedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
                color: feedback.type === 'success' ? '#15803d' : '#b91c1c',
                border: `1px solid ${feedback.type === 'success' ? '#bbf7d0' : '#fecaca'}`
              }}>
                {feedback.text}
              </div>
            )}

            {/* Time Slots Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {SLOTS.map((timeSlot) => {
                const booking = dayBookings.find(b => b.timeSlot === timeSlot);
                const isBooked = !!booking;
                const isMine = booking?.isMine;

                return (
                  <div 
                    key={timeSlot}
                    style={{
                      border: isMine 
                        ? '1.5px solid #16a34a' 
                        : isBooked 
                        ? '1px solid #e2e8f0' 
                        : '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      backgroundColor: isMine ? '#f0fdf4' : isBooked ? '#f8fafc' : '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '1rem' }}>
                        ⏰ {timeSlot} - {parseInt(timeSlot.split(':')[0], 10) + 1}:00
                      </span>

                      {isMine ? (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          backgroundColor: '#dcfce7', 
                          color: '#15803d', 
                          padding: '0.15rem 0.5rem', 
                          borderRadius: '4px',
                          fontWeight: 600
                        }}>
                          YOUR LESSON
                        </span>
                      ) : isBooked ? (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          backgroundColor: '#e2e8f0', 
                          color: '#475569', 
                          padding: '0.15rem 0.5rem', 
                          borderRadius: '4px',
                          fontWeight: 500
                        }}>
                          BOOKED
                        </span>
                      ) : (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          backgroundColor: '#eff6ff', 
                          color: '#2563eb', 
                          padding: '0.15rem 0.5rem', 
                          borderRadius: '4px',
                          fontWeight: 500
                        }}>
                          AVAILABLE
                        </span>
                      )}
                    </div>

                    {/* Booking Details / Actions */}
                    <div style={{ marginTop: '0.25rem' }}>
                      {isMine ? (
                        <button 
                          className="btn btn-red"
                          disabled={actionLoading}
                          style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                          onClick={() => handleCancelSlot(booking.id, timeSlot)}
                        >
                          Cancel Booking (Refund)
                        </button>
                      ) : isBooked ? (
                        isAdmin ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#1e293b' }}>
                              👤 <strong>{booking.studentName}</strong>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {booking.studentEmail}
                            </div>
                            <button 
                              className="btn btn-red"
                              disabled={actionLoading}
                              style={{ width: '100%', padding: '0.35rem 0.5rem', fontSize: '0.8rem', marginTop: '0.25rem' }}
                              onClick={() => handleCancelSlot(booking.id, timeSlot)}
                            >
                              Cancel Session (Refund)
                            </button>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Reserved by another student
                          </div>
                        )
                      ) : !isAdmin ? (
                        <button 
                          className="btn btn-green"
                          disabled={actionLoading || lessonsBalance < 1}
                          style={{ 
                            width: '100%', 
                            padding: '0.4rem 0.6rem', 
                            fontSize: '0.85rem',
                            opacity: lessonsBalance < 1 ? 0.6 : 1,
                            cursor: lessonsBalance < 1 ? 'not-allowed' : 'pointer'
                          }}
                          onClick={() => handleBookSlot(timeSlot)}
                        >
                          {lessonsBalance < 1 ? 'No Lessons Left' : 'Book Session (1 Credit)'}
                        </button>
                      ) : (
                        <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 500 }}>
                          Open for student bookings
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
