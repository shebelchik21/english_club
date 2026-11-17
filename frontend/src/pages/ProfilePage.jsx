import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const ProfilePage = ({ setCurrentPage }) => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <h2>Access Restricted</h2>
          <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>
            Please sign in to access your English Club member dashboard.
          </p>
          <button className="btn" onClick={() => setCurrentPage('login')}>
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '640px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Member Profile</h2>
          <span style={{ 
            backgroundColor: '#dbeafe', 
            color: '#1e40af', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px', 
            fontSize: '0.85rem', 
            fontWeight: 600,
            textTransform: 'uppercase'
          }}>
            {user.role || 'Student'}
          </span>
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
          <button className="btn" style={{ backgroundColor: '#ef4444' }} onClick={logout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
