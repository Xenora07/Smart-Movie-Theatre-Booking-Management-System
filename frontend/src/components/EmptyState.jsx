import React from 'react';
import { Film, Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Film,
  title = 'No movies or schedules found',
  description,
  action
}) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-xl)',
      border: '1px dashed var(--border-light)',
      maxWidth: '580px',
      margin: '2.5rem auto'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.2rem',
        color: 'var(--accent-gold)'
      }}>
        <Icon size={30} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      {description && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.6rem', lineHeight: 1.6 }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
};
