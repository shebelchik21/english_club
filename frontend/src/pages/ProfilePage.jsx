import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../services/api.js';
import { isSessionCompleted, hasSessionStarted, getClubCurrentDateTime } from '../utils/timezone.js';

export const ProfilePage = ({ setCurrentPage }) => {
  const { user, token, logout, refreshUser } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const isAdmin = user?.role === 'admin';
  const pad = (n) => String(n).padStart(2, '0');

  const fetchLessons = async () => {
    if (!token) return;
    try {
      setLoadingBookings(true);
      if (isAdmin) {
        const clubNow = getClubCurrentDateTime();
        const startDateStr = clubNow.currentDateStr;
        const endD = new Date(clubNow.year, clubNow.month - 1, clubNow.day + 6);
        const endDateStr = `${endD.getFullYear()}-${pad(endD.getMonth() + 1)}-${pad(endD.getDate())}`;
        const data = await apiRequest(`/bookings/upcoming?startDate=${startDateStr}&endDate=${endDateStr}`, 'GET', null, token);
        setLessons(data.bookings || []);
      } else {
        const data = await apiRequest('/bookings/my', 'GET', null, token);
        setLessons(data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load scheduled lessons:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
    fetchLessons();

    // Auto-update every 5s after any bookings or cancellations
    const interval = setInterval(() => {
      fetchLessons();
    }, 5000);

    const onFocus = () => fetchLessons();
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [token, user?.role]);

  const handleCancelBooking = async (bookingId, date, slot, studentName) => {
    if (hasSessionStarted(date, slot)) {
      alert('Cannot cancel a past session or a session that has already started.');
      return;
    }

    const confirmMsg = isAdmin
      ? `Are you sure you want to cancel the lesson on ${date} at ${slot}${studentName ? ` for ${studentName}` : ''}? 1 lesson credit will be refunded to the student.`
      : `Are you sure you want to cancel the lesson on ${date} at ${slot}? 1 lesson credit will be refunded.`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await apiRequest(`/bookings/${bookingId}`, 'DELETE', null, token);
      await fetchLessons();
      if (refreshUser) await refreshUser();
    } catch (err) {
      alert(err.message || 'Failed to cancel lesson.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <h2>Access Restricted</h2>
          <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>
            Please sign in to access your English Club member dashboard.
          </p>
          <button className="btn btn-blue" onClick={() => setCurrentPage('login')}>
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const lessonsCount = user.lessonsCount !== undefined ? user.lessonsCount : 0;

  const completedCount = lessons.filter(b => 
    isSessionCompleted(b.bookingDate || b.booking_date, b.timeSlot || b.time_slot)
  ).length;

  const sortedLessons = [...lessons].sort((a, b) => {
    const dateA = a.bookingDate || a.booking_date || '';
    const dateB = b.bookingDate || b.booking_date || '';
    const cmp = dateA.localeCompare(dateB);
    if (cmp !== 0) return cmp;
    const slotA = a.timeSlot || a.time_slot || '';
    const slotB = b.timeSlot || b.time_slot || '';
    return slotA.localeCompare(slotB);
  });

  return (
    <div className="container" style={{ maxWidth: '680px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Member Profile</h2>
        </div>

        {/* Lessons Balance Highlight Card */}
        {user.role !== 'admin' && (
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '1px solid #bfdbfe',
            borderRadius: '10px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Lesson Balance
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e3a8a', marginTop: '0.25rem' }}>
                {lessonsCount} {lessonsCount === 1 ? 'lesson' : 'lessons'}
              </div>
            </div>
            <div>
              <button 
                className="btn btn-green" 
                style={{ fontSize: '0.9rem', padding: '0.6rem 1.1rem' }}
                onClick={() => setCurrentPage('calendar')}
              >
                📅 Schedule Lesson
              </button>
            </div>
          </div>
        )}

        {/* Completed Lessons Highlight Card */}
        {user.role !== 'admin' && (
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: '1px solid #bbf7d0',
            borderRadius: '10px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Completed Lessons
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#14532d', marginTop: '0.25rem' }}>
                {completedCount} {completedCount === 1 ? 'lesson' : 'lessons'}
              </div>
            </div>
            <div style={{ fontSize: '2rem' }}>
              🎓
            </div>
          </div>
        )}

        {/* User Info Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Full Name
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 500, marginTop: '0.25rem' }}>
              {user.name}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Email Address
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 500, marginTop: '0.25rem' }}>
              {user.email}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Club Membership Status
            </div>
            <div style={{ fontSize: '1rem', color: '#16a34a', fontWeight: 500, marginTop: '0.25rem' }}>
              ● {user.role === 'admin' ? 'Admin' : 'Student'}
            </div>
          </div>
        </div>

        {/* Scheduled Lessons Section */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🗓️</span>
                <span>Your Scheduled Lessons</span>
                <span style={{ 
                  fontSize: '0.8rem', 
                  backgroundColor: '#f1f5f9', 
                  color: '#475569', 
                  padding: '0.15rem 0.5rem', 
                  borderRadius: '9999px', 
                  fontWeight: 600
                }}>
                  {sortedLessons.length}
                </span>
              </h3>
              {isAdmin && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Student-booked sessions for the next 7 days
                </div>
              )}
            </div>

            <button 
              className="btn" 
              style={{ background: '#f8fafc', color: '#2563eb', border: '1px solid #cbd5e1', fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
              onClick={() => setCurrentPage('calendar')}
            >
              Open Calendar
            </button>
          </div>

          {loadingBookings && sortedLessons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
              Loading scheduled lessons...
            </div>
          ) : sortedLessons.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem 1rem', 
              background: '#f8fafc', 
              borderRadius: '8px', 
              border: '1px dashed #cbd5e1' 
            }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {isAdmin 
                  ? 'No student lessons scheduled for the next 7 days.' 
                  : 'You have no scheduled lessons right now.'}
              </p>
              {isAdmin ? (
                <button 
                  className="btn btn-blue"
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => setCurrentPage('calendar')}
                >
                  View Full Calendar
                </button>
              ) : lessonsCount > 0 ? (
                <button 
                  className="btn btn-green"
                  style={{ fontSize: '0.9rem' }}
                  onClick={() => setCurrentPage('calendar')}
                >
                  Book Your Next Lesson
                </button>
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Ask your administrator to add lessons to your balance to book a time slot.
                </span>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sortedLessons.map((b) => {
                const dateStr = b.bookingDate || b.booking_date;
                const slotStr = b.timeSlot || b.time_slot;
                const startHour = parseInt(slotStr.split(':')[0], 10);
                const endHour = startHour + 1;
                const endSlotStr = `${String(endHour).padStart(2, '0')}:00`;
                const studentName = b.studentName || b.user_name;

                // Parse date safely
                const dateParts = dateStr.split('-');
                const localDate = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10));
                const formattedDate = localDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div 
                    key={b.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.9rem 1.1rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%', 
                        backgroundColor: '#16a34a',
                        flexShrink: 0
                      }}></div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>
                          {formattedDate}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#334155', marginTop: '0.15rem' }}>
                          ⏰ {slotStr} - {endSlotStr}
                        </div>
                        {isAdmin && studentName && (
                          <div style={{ fontSize: '0.88rem', color: '#1e40af', fontWeight: 600, marginTop: '0.25rem' }}>
                            👤 {studentName}
                            {b.studentEmail && (
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.35rem' }}>
                                ({b.studentEmail})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {hasSessionStarted(dateStr, slotStr) ? (
                      <span style={{ 
                        fontSize: '0.78rem', 
                        color: '#64748b', 
                        fontWeight: 600, 
                        backgroundColor: '#f1f5f9', 
                        padding: '0.35rem 0.65rem', 
                        borderRadius: '4px' 
                      }}>
                        {isAdmin ? 'Completed' : 'Passed'}
                      </span>
                    ) : (
                      <button 
                        className="btn btn-red"
                        disabled={cancellingId === b.id}
                        style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                        onClick={() => handleCancelBooking(b.id, dateStr, slotStr, studentName)}
                      >
                        {cancellingId === b.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          <button className="btn btn-red" onClick={logout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
