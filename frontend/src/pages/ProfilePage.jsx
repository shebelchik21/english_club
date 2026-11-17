import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const ProfilePage = ({ setCurrentPage }) => {
  const { user, logout, refreshUser } = useAuth();

  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
  }, []);

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
    <div className="container" style={{ maxWidth: '640px' }}>
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
          <div style={{ fontSize: '2.5rem' }}>
            🎓
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
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

        <div style={{ marginTop: '2rem', display: 'flex', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          <button className="btn btn-red" onClick={logout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
