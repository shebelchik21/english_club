import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const Navbar = ({ setCurrentPage }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
    }}>
      <div 
        style={{ fontWeight: 'bold', fontSize: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
        onClick={() => setCurrentPage('home')}
      >
        <span>🇬🇧</span>
        <span>English Club</span>
        {isAdmin && (
          <span style={{ 
            fontSize: '0.75rem', 
            backgroundColor: '#fee2e2', 
            color: '#b91c1c', 
            padding: '0.15rem 0.5rem', 
            borderRadius: '4px',
            marginLeft: '0.25rem'
          }}>
            Admin
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {user ? (
          <>
            {isAdmin && (
              <button 
                className="btn" 
                style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #cbd5e1' }}
                onClick={() => setCurrentPage('students')}
              >
                👥 Students
              </button>
            )}

            <button 
              className="btn" 
              style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #cbd5e1' }}
              onClick={() => setCurrentPage('calendar')}
            >
              📅 Calendar
            </button>

            <button 
              className="btn btn-blue" 
              onClick={() => setCurrentPage('profile')}
            >
              👤 Profile
            </button>

            <button 
              className="btn btn-red" 
              onClick={logout}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button 
              className="btn btn-blue" 
              onClick={() => setCurrentPage('login')}
            >
              Login
            </button>
            <button 
              className="btn btn-green" 
              onClick={() => setCurrentPage('register')}
            >
              Join Club
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
