import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export const ProtectedRoute = ({ children, requireAdmin = false, customerOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="card-box" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>403 — Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          This section requires Administrator privileges. Your account is not authorized to access this resource.
        </p>
        <a href="/" className="btn btn-secondary">
          Return to Home
        </a>
      </div>
    );
  }

  if (customerOnly && isAdmin) {
    return (
      <div className="card-box" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Administrator Account Detected</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Personal ticket bookings and reservations are reserved for Customer accounts. As an administrator, you can view and audit all system-wide bookings and financial transactions from the Admin Console.
        </p>
        <a href="/admin" className="btn btn-primary">
          Go to Admin Console
        </a>
      </div>
    );
  }

  return children;
};
