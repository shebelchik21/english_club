import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const RegisterPage = ({ setCurrentPage }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      setSuccess(true);
      setTimeout(() => setCurrentPage('login'), 1500);
    } catch (err) {
      setError(err.message || 'Ошибка при регистрации');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '440px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Регистрация</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ color: '#16a34a', marginBottom: '1rem' }}>Успешно! Перенаправление...</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имя</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ваше имя" 
            />
          </div>
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
              placeholder="Минимум 6 символов" 
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>Создать аккаунт</button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Уже есть аккаунт?{' '}
          <span 
            style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setCurrentPage('login')}
          >
            Войти
          </span>
        </p>
      </div>
    </div>
  );
};
