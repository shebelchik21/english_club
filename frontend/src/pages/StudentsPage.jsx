import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../services/api.js';

export const StudentsPage = ({ setCurrentPage }) => {
  const { user, token } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected student for lesson assignment modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [customCount, setCustomCount] = useState('');
  const [updating, setUpdating] = useState(false);
  const [modalFeedback, setModalFeedback] = useState({ type: '', text: '' });

  const fetchStudents = async () => {
    try {
      const data = await apiRequest('/admin/students', 'GET', null, token);
      setStudents(data.students || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch students list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStudents();
    }
  }, [user, token]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <h2>Access Denied</h2>
          <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>
            This page is only accessible to English Club administrators.
          </p>
          <button className="btn btn-blue" onClick={() => setCurrentPage('home')}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const handleAdjustLessons = async (studentId, delta = null, exactCount = null) => {
    setUpdating(true);
    setModalFeedback({ type: '', text: '' });

    try {
      const payload = delta !== null ? { delta } : { count: exactCount };
      const response = await apiRequest(`/admin/students/${studentId}/lessons`, 'PATCH', payload, token);

      const updatedCount = response.student.lessonsCount;

      // Update state in modal
      setSelectedStudent(prev => prev ? { ...prev, lessons_count: updatedCount } : null);

      // Update state in table list
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, lessons_count: updatedCount } : s));

      setModalFeedback({ type: 'success', text: `Lessons balance updated to ${updatedCount}!` });
      setCustomCount('');
    } catch (err) {
      setModalFeedback({ type: 'error', text: err.message || 'Failed to update lessons balance.' });
    } finally {
      setUpdating(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>👥</span>
              <span>Registered Students</span>
              <span style={{ 
                fontSize: '0.85rem', 
                backgroundColor: '#dbeafe', 
                color: '#1e40af', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '9999px', 
                fontWeight: 600
              }}>
                {students.length}
              </span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Click on any student to assign, add, or deduct lesson credits
            </p>
          </div>

          <div style={{ minWidth: '240px' }}>
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.9rem',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                fontSize: '0.95rem'
              }}
            />
          </div>
        </div>

        {error && (
          <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading students list...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            {search ? 'No students found matching your search.' : 'No registered students yet.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>ID</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Name</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Email</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Lessons Balance</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Registered At</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const balance = student.lessons_count || 0;
                  return (
                    <tr 
                      key={student.id} 
                      onClick={() => {
                        setSelectedStudent(student);
                        setModalFeedback({ type: '', text: '' });
                        setCustomCount('');
                      }}
                      style={{ 
                        borderBottom: '1px solid var(--border-color)', 
                        cursor: 'pointer',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600 }}>#{student.id}</td>
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: 500 }}>{student.name}</td>
                      <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>{student.email}</td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <span style={{ 
                          backgroundColor: balance > 0 ? '#dcfce7' : '#f1f5f9', 
                          color: balance > 0 ? '#15803d' : '#64748b', 
                          padding: '0.25rem 0.65rem', 
                          borderRadius: '9999px', 
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}>
                          {balance} {balance === 1 ? 'lesson' : 'lessons'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {new Date(student.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <button 
                          className="btn" 
                          style={{ padding: '0.35rem 0.8rem', fontSize: '0.85rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(student);
                            setModalFeedback({ type: '', text: '' });
                            setCustomCount('');
                          }}
                        >
                          Manage Lessons
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lesson Assignment Modal */}
      {selectedStudent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', position: 'relative' }}>
            <button 
              onClick={() => setSelectedStudent(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                fontSize: '1.25rem',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              ✕
            </button>

            <h3 style={{ marginBottom: '0.25rem' }}>Lesson Assignment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Student: <strong>{selectedStudent.name}</strong> ({selectedStudent.email})
            </p>

            {modalFeedback.text && (
              <div style={{
                padding: '0.75rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                backgroundColor: modalFeedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
                color: modalFeedback.type === 'success' ? '#15803d' : '#b91c1c',
                border: `1px solid ${modalFeedback.type === 'success' ? '#bbf7d0' : '#fecaca'}`
              }}>
                {modalFeedback.text}
              </div>
            )}

            {/* Current Balance Display */}
            <div style={{
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Current Balance
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#2563eb', margin: '0.25rem 0' }}>
                {selectedStudent.lessons_count || 0}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {(selectedStudent.lessons_count || 0) === 1 ? 'lesson available' : 'lessons available'}
              </div>
            </div>

            {/* Quick Adjustment Buttons */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Quick Adjustment:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                <button 
                  className="btn" 
                  disabled={updating || (selectedStudent.lessons_count || 0) < 1}
                  style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}
                  onClick={() => handleAdjustLessons(selectedStudent.id, -1)}
                >
                  − 1
                </button>
                <button 
                  className="btn" 
                  disabled={updating}
                  style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }}
                  onClick={() => handleAdjustLessons(selectedStudent.id, +1)}
                >
                  + 1
                </button>
                <button 
                  className="btn" 
                  disabled={updating}
                  style={{ backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' }}
                  onClick={() => handleAdjustLessons(selectedStudent.id, +5)}
                >
                  + 5
                </button>
                <button 
                  className="btn" 
                  disabled={updating}
                  style={{ backgroundColor: '#e0e7ff', color: '#4338ca', border: '1px solid #c7d2fe' }}
                  onClick={() => handleAdjustLessons(selectedStudent.id, +10)}
                >
                  + 10
                </button>
              </div>
            </div>

            {/* Set Exact Amount */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Set Exact Lessons Count:
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (customCount !== '' && !isNaN(customCount)) {
                    handleAdjustLessons(selectedStudent.id, null, parseInt(customCount, 10));
                  }
                }}
                style={{ display: 'flex', gap: '0.5rem' }}
              >
                <input 
                  type="number"
                  min="0"
                  placeholder="e.g. 8"
                  value={customCount}
                  onChange={(e) => setCustomCount(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                />
                <button 
                  type="submit" 
                  className="btn btn-blue"
                  disabled={updating || customCount === ''}
                >
                  Set Count
                </button>
              </form>
            </div>

            <div style={{ textAlign: 'right', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button 
                className="btn" 
                style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1' }}
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
