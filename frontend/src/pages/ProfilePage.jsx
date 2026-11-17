import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../services/api.js';

export const ProfilePage = ({ setCurrentPage }) => {
  const { user, token, logout, refreshUser } = useAuth();
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchMyBookings = async () => {
    if (!token) return;
    try {
      setLoadingBookings(true);
      const data = await apiRequest('/bookings/my', 'GET', null, token);
      setMyBookings(data.bookings || []);
    } catch (err) {
      console.error('Failed to load my bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
    fetchMyBookings();
  }, [token]);

  const handleCancelBooking = async (bookingId, date, slot) => {
    if (!window.confirm(`Are you sure you want to cancel the lesson on ${date} at ${slot}? 1 lesson credit will be refunded.`)) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await apiRequest(`/bookings/${bookingId}`, 'DELETE', null, token);
      await fetchMyBookings();
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

  return (
    <div className="container" style={{ maxWidth: '680px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Member Profile</h2>
          <span style={{ 
            backgroundColor: user.role === 'admin' ? '#fee2e2' : '#dbeafe', 
            color: user.role === 'admin' ? '#b91c1c' : '#1e40af', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px', 
            fontSize: '0.85rem', 
            fontWeight: 600,
            textTransform: 'uppercase'
          }}>
            {user.role || 'Student'}
          </span>
        </div>

        {/* Lessons Balance Highlight Card */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '10px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Lesson Balance
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e3a8a', marginTop: '0.25rem' }}>
              {lessonsCount} {lessonsCount === 1 ? 'lesson' : 'lessons'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#3b82f6', marginTop: '0.25rem' }}>
              {lessonsCount > 0 
                ? 'Ready for your next speaking club or session!' 
                : 'Contact the administrator to top up your lessons.'}
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
              ● Active Member
            </div>
          </div>
        </div>

        {/* My Scheduled Lessons Section */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
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
                {myBookings.length}
              </span>
            </h3>

            <button 
              className="btn" 
              style={{ background: '#f8fafc', color: '#2563eb', border: '1px solid #cbd5e1', fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
              onClick={() => setCurrentPage('calendar')}
            >
              Open Calendar
            </button>
          </div>

          {loadingBookings ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
              Loading your scheduled lessons...
            </div>
          ) : myBookings.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem 1rem', 
              background: '#f8fafc', 
              borderRadius: '8px', 
              border: '1px dashed #cbd5e1' 
            }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                You have no scheduled lessons right now.
              </p>
              {lessonsCount > 0 ? (
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
              {myBookings.map((b) => (
                <div 
                  key={b.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.9rem 1.1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '50%', 
                      backgroundColor: '#16a34a' 
                    }}></div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        {new Date(b.booking_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        ⏰ {b.time_slot} - {parseInt(b.time_slot.split(':')[0], 10) + 1}:00
                      </div>
                    </div>
                  </div>

                  <button 
                    className="btn btn-red"
                    disabled={cancellingId === b.id}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                    onClick={() => handleCancelBooking(b.id, b.booking_date, b.time_slot)}
                  >
                    {cancellingId === b.id ? 'Cancelling...' : 'Cancel'}
                  </button>
                </div>
              ))}
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
