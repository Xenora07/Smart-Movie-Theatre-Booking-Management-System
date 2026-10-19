import React from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, Database, ShieldCheck, Cpu, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-darkest)',
      padding: '3rem 1.5rem 2rem',
      color: 'var(--text-muted)',
      fontSize: '0.88rem'
    }} className="no-print">
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'var(--grad-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clapperboard size={16} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Cine<span style={{ color: 'var(--accent-gold)' }}>Wave</span>
              </span>
            </div>
            <p style={{ lineHeight: 1.6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Next-generation cinema ticketing experience with real-time seat availability, multi-tier pricing, and relational ACID booking guarantees.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.9rem' }}>
              Cinema Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home &amp; Highlights</Link>
              </li>
              <li>
                <Link to="/movies" style={{ color: 'var(--text-secondary)' }}>Movie Catalogue</Link>
              </li>
              <li>
                <Link to="/my-bookings" style={{ color: 'var(--text-secondary)' }}>My Reserved Tickets</Link>
              </li>
              <li>
                <Link to="/admin" style={{ color: 'var(--text-secondary)' }}>Management Console</Link>
              </li>
            </ul>
          </div>

          {/* System & Architecture */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.9rem' }}>
              DBMS Architecture
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)' }}>
                <Database size={15} />
                <span>Exactly 9 Core Tables (MySQL 8)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-green)' }}>
                <ShieldCheck size={15} />
                <span>BCrypt &amp; JWT Stateless Auth</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <Cpu size={15} />
                <span>Spring Data JPA • Isolation.READ_COMMITTED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-faint)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} CineWave Cinema Ticketing System. Academic DBMS Microproject.
          </div>
          <div>
            Built with React 18, Vite, Java 17, Spring Boot 3.3.5 &amp; MySQL 8.0.
          </div>
        </div>
      </div>
    </footer>
  );
};
