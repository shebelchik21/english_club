import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const LoginPage = ({ setCurrentPage }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      setCurrentPage('profile');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '440px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Log in to your English Club account
        </p>

        {error && (
          <div style={{ 
            color: '#b91c1c', 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            padding: '0.75rem', 
            borderRadius: '6px', 
            marginBottom: '1rem',
            fontSize: '0.9rem' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="alex@example.com" 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account yet?{' '}
          <span 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 500, textDecoration: 'underline' }}
            onClick={() => setCurrentPage('register')}
          >
            Join Club
          </span>
        </p>
      </div>
    </div>
  );
};
