import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const ProfilePage = ({ setCurrentPage }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <p>Пожалуйста, войдите в систему для доступа к личному кабинету.</p>
          <button className="btn" style={{ marginTop: '1rem' }} onClick={() => setCurrentPage('login')}>
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Личный кабинет</h2>
        <div style={{ marginTop: '1.5rem', lineHeight: '2' }}>
          <p><strong>Имя:</strong> {user.name || 'Пользователь'}</p>
          <p><strong>Email:</strong> {user.email || 'Не указан'}</p>
          <p><strong>Уровень доступа:</strong> {user.role || 'Студент'}</p>
        </div>
      </div>
    </div>
  );
};
