import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const CalendarPage = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!user) {
    return (
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <h2>Please Sign In</h2>
          <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>
            Sign in to view the English Club calendar and schedule.
          </p>
          <button className="btn btn-blue" onClick={() => setCurrentPage('login')}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Calculate days for the calendar grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon, ...
  // Convert so Monday is 0:
  const startOffset = (firstDayIndex + 6) % 7;

  const days = [];
  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const isCurrentMonthToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="container" style={{ maxWidth: '820px' }}>
      <div className="card">
        {/* Header Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📅</span>
              <span>{monthNames[month]} {year}</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Club Schedule & Monthly Calendar
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button 
              className="btn" 
              style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '0.5rem 1rem' }} 
              onClick={prevMonth}
              title="Previous Month"
            >
              ← Prev
            </button>
            <button 
              className="btn btn-blue" 
              style={{ padding: '0.5rem 1rem' }} 
              onClick={goToToday}
            >
              Today
            </button>
            <button 
              className="btn" 
              style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '0.5rem 1rem' }} 
              onClick={nextMonth}
              title="Next Month"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          {daysOfWeek.map((dayName, idx) => (
            <div key={dayName} style={{ padding: '0.5rem', fontSize: '0.9rem', color: idx >= 5 ? '#ef4444' : 'inherit' }}>
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} style={{ minHeight: '80px', background: '#fafafa', borderRadius: '8px' }} />;
            }

            const isToday = isCurrentMonthToday(day);

            return (
              <div 
                key={day}
                style={{
                  minHeight: '80px',
                  padding: '0.6rem',
                  borderRadius: '8px',
                  border: isToday ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: isToday ? '#eff6ff' : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'background-color 0.15s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontWeight: isToday ? 700 : 500,
                    fontSize: '1rem',
                    color: isToday ? '#1d4ed8' : '#1e293b'
                  }}>
                    {day}
                  </span>
                  {isToday && (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      backgroundColor: '#2563eb', 
                      color: '#ffffff', 
                      padding: '0.1rem 0.4rem', 
                      borderRadius: '4px',
                      fontWeight: 600
                    }}>
                      TODAY
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {/* Slot placeholder for events */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
