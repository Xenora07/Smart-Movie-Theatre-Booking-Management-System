import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ErrorMessage } from '../components/ErrorMessage';
import { Lock, Mail, Clapperboard, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const user = await login(email, password);
      if (user.role === 'ADMIN' && from === '/') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div style={{ maxWidth: '460px', margin: '3.5rem auto' }}>
      <div className="card-box" style={{ padding: '2.8rem 2.4rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--grad-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 14px rgba(234, 88, 12, 0.4)'
          }}>
            <Clapperboard size={24} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Sign in to access your digital tickets and reserved seats
          </p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={14} />
              <span>Email Address</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.8rem' }}>
            <label htmlFor="password" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={14} />
              <span>Password</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '1rem' }}
          >
            {loading ? 'Authenticating with BCrypt...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Fill Helper for Viva */}
        <div style={{
          marginTop: '2.2rem',
          paddingTop: '1.6rem',
          borderTop: '1px dashed var(--border-subtle)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.9rem', fontWeight: 800, letterSpacing: '0.05em' }}>
            ⚡ Instant Demo Accounts (MySQL BCrypt)
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => fillDemo('admin@cinema.local', 'Admin@1234')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ShieldCheck size={14} color="var(--accent-red)" />
              <span>Demo Admin</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('alice@cinema.local', 'Customer@1234')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <UserCheck size={14} color="var(--accent-green)" />
              <span>Demo Alice</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.6rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
};
