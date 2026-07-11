import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../config/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const userFromStorage = localStorage.getItem('user');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        setToken(storedToken);

        if (userFromStorage) {
          setUser(JSON.parse(userFromStorage));
        }

        // ✅ Verify token with backend
        const meRes = await axios.get(apiUrl('/api/auth/me'), {
          headers: { Authorization: `Bearer ${storedToken}` }
        });

        const safeUser = meRes.data?.user || null;

        setUser(safeUser);
        localStorage.setItem('user', JSON.stringify(safeUser));

      } catch (error) {
        console.error("Auth check failed:", error);

        // 🔥 Clear invalid session
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ✅ LOGIN FUNCTION (IMPROVED)
  const login = (userData, authToken) => {
    if (!userData || !authToken) {
      console.error("Login failed: Missing user or token");
      return;
    }

    setUser(userData);
    setToken(authToken);

    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const signup = (userData, authToken) => {
    login(userData, authToken);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        signup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}