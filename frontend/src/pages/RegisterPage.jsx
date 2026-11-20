import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const RegisterPage = ({ setCurrentPage }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(name, email, password);
      setSuccess(true);
      setTimeout(() => setCurrentPage('login'), 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '440px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Join English Club</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Start speaking fluent English today
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

        {success && (
          <div style={{ 
            color: '#15803d', 
            backgroundColor: '#f0fdf4', 
            border: '1px solid #bbf7d0', 
            padding: '0.75rem', 
            borderRadius: '6px', 
            marginBottom: '1rem',
            fontSize: '0.9rem' 
          }}>
            Account created successfully! Redirecting to sign in...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)} 
              placeholder="Alex Johnson" 
            />
          </div>

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
              placeholder="At least 6 characters" 
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={isLoading || success}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <span 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 500, textDecoration: 'underline' }}
            onClick={() => setCurrentPage('login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};
