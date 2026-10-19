import React from 'react';

export const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1rem',
      gap: '1rem',
      color: 'var(--text-secondary)'
    }}>
      <div style={{
        width: '42px',
        height: '42px',
        border: '3px solid rgba(245, 158, 11, 0.2)',
        borderTopColor: 'var(--accent-gold)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{text}</span>
    </div>
  );
};
