import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../services/api.js';

export const StudentsPage = ({ setCurrentPage }) => {
  const { user, token } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
              List of all learners registered in the English Club
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
                  <th style={{ padding: '0.75rem 0.5rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Registered At</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600 }}>#{student.id}</td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 500 }}>{student.name}</td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>{student.email}</td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span style={{ 
                        backgroundColor: '#f1f5f9', 
                        color: '#334155', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        fontWeight: 500
                      }}>
                        {student.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {new Date(student.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
