import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const HomePage = ({ setCurrentPage }) => {
  const { user } = useAuth();

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a' }}>
          Welcome to English Club
        </h1>
        <p style={{ maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--text-muted)', fontSize: '1.15rem' }}>
          Level up your English fluency through interactive speaking clubs, certified native coaches, and a passionate community of learners.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {user ? (
            <button className="btn" style={{ padding: '0.8rem 1.8rem', fontSize: '1.05rem' }} onClick={() => setCurrentPage('profile')}>
              Go to Your Profile
            </button>
          ) : (
            <>
              <button className="btn" style={{ padding: '0.8rem 1.8rem', fontSize: '1.05rem' }} onClick={() => setCurrentPage('register')}>
                Get Started Free
              </button>
              <button className="btn" style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1' }} onClick={() => setCurrentPage('login')}>
                Member Sign In
              </button>
            </>
          )}
        </div>
      </div>

      {/* Feature Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗣️</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Speaking Sessions</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Daily conversational roundtables organized by CEFR levels from Beginner (A1) to Advanced (C1).
          </p>
        </div>

        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌍</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Native Speakers</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Practice authentic idioms, correct your pronunciation, and boost real-life communication confidence.
          </p>
        </div>

        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎬</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Movie & Book Clubs</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Engage in discussions about trending TED Talks, cinema, literature, and current global events.
          </p>
        </div>
      </div>
    </div>
  );
};
