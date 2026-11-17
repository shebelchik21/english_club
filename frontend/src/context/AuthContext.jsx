import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const data = await apiRequest('/auth/me', 'GET', null, token);
          setUser(data.user);
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', 'POST', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }
    return data;
  };

  const register = async (name, email, password) => {
    return await apiRequest('/auth/register', 'POST', { name, email, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
