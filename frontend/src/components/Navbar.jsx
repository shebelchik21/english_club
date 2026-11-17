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
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>
        🇬🇧 English Club
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button className="btn" style={{ background: 'transparent', color: '#1e293b' }} onClick={() => setCurrentPage('home')}>Главная</button>
        {user ? (
          <>
            <button className="btn" style={{ background: 'transparent', color: '#1e293b' }} onClick={() => setCurrentPage('profile')}>Профиль</button>
            <button className="btn" onClick={logout}>Выйти</button>
          </>
        ) : (
          <>
            <button className="btn" style={{ background: 'transparent', color: '#1e293b' }} onClick={() => setCurrentPage('login')}>Вход</button>
            <button className="btn" onClick={() => setCurrentPage('register')}>Регистрация</button>
          </>
        )}
      </div>
    </nav>
  );
};
