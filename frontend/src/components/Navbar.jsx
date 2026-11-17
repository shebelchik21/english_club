import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const Navbar = ({ setCurrentPage }) => {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0'
    }}>
      <div 
        style={{ fontWeight: 'bold', fontSize: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
        onClick={() => setCurrentPage('home')}
      >
        <span>🇬🇧</span>
        <span>English Club</span>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button className="btn" style={{ background: 'transparent', color: '#1e293b' }} onClick={() => setCurrentPage('home')}>
          Home
        </button>
        {user ? (
          <>
            <button className="btn" style={{ background: 'transparent', color: '#1e293b' }} onClick={() => setCurrentPage('profile')}>
              Profile ({user.name || 'Member'})
            </button>
            <button className="btn" style={{ backgroundColor: '#ef4444' }} onClick={logout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button className="btn" style={{ background: 'transparent', color: '#1e293b' }} onClick={() => setCurrentPage('login')}>
              Sign In
            </button>
            <button className="btn" onClick={() => setCurrentPage('register')}>
              Join Club
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
