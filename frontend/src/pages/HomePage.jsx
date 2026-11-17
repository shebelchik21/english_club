import React from 'react';

export const HomePage = ({ setCurrentPage }) => {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h1>Добро пожаловать в English Club!</h1>
        <p style={{ margin: '1rem 0 2rem', color: 'var(--text-muted)' }}>
          Платформа для изучения английского языка, разговорных клубов и практики.
        </p>
        <button className="btn" onClick={() => setCurrentPage('register')}>
          Присоединиться к клубу
        </button>
      </div>
    </div>
  );
};
