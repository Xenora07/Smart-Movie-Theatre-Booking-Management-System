import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const profile = await authService.getCurrentUser();
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch (err) {
          // Token invalid or expired
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();

    const handleAuthLogout = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth-logout', handleAuthLogout);
    return () => window.removeEventListener('auth-logout', handleAuthLogout);
  }, [token]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setToken(data.token);
    localStorage.setItem('token', data.token);

    const userObj = {
      customerId: data.customerId,
      name: data.name,
      email: data.email,
      role: data.role
    };
    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
    return userObj;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    setToken(data.token);
    localStorage.setItem('token', data.token);

    const userObj = {
      customerId: data.customerId,
      name: data.name,
      email: data.email,
      role: data.role
    };
    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
    return userObj;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
