import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div style={{
      maxWidth: '850px',
      margin: '1.5rem auto',
      padding: '1.1rem 1.4rem',
      backgroundColor: 'var(--color-error-bg)',
      border: '1px solid var(--color-error-border)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1.2rem',
      boxShadow: '0 4px 14px rgba(239, 68, 68, 0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={22} color="var(--accent-red)" style={{ flexShrink: 0 }} />
        <span style={{ color: 'var(--color-error-text)', fontSize: '0.92rem', fontWeight: 600 }}>
          {message}
        </span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary btn-sm"
          style={{
            borderColor: 'var(--color-error-border)',
            color: 'var(--color-error-text)',
            backgroundColor: 'var(--color-error-bg)',
            flexShrink: 0
          }}
        >
          <RefreshCw size={14} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
