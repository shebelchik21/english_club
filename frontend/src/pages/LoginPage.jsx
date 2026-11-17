import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const LoginPage = ({ setCurrentPage }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      setCurrentPage('profile');
    } catch (err) {
      setError(err.message || 'Ошибка входа');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '440px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Вход в аккаунт</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="example@mail.com" 
            />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>Войти</button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Еще нет аккаунта?{' '}
          <span 
            style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setCurrentPage('register')}
          >
            Зарегистрироваться
          </span>
        </p>
      </div>
    </div>
  );
};
