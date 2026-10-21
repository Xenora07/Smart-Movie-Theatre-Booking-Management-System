import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeSelector } from './ThemeSelector';
import { Film, Ticket, LayoutDashboard, User, LogOut, Menu, X, Clapperboard, Compass } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--grad-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(234, 88, 12, 0.4)'
          }}>
            <Clapperboard size={20} color="#ffffff" />
          </div>
          <span>Cine<span className="highlight">Wave</span></span>
          <span className="brand-badge">Cinema</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="nav-links" style={{ display: mobileMenuOpen ? 'none' : 'flex' }}>
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              <Compass size={17} />
              <span>Explore</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/movies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Film size={17} />
              <span>Movies</span>
            </NavLink>
          </li>
          {isAuthenticated && !isAdmin && (
            <li>
              <NavLink to="/my-bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Ticket size={17} />
                <span>My Tickets</span>
              </NavLink>
            </li>
          )}
          {isAdmin && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={17} />
                <span>Admin Console</span>
              </NavLink>
            </li>
          )}
        </ul>

        {/* Auth / Profile & Theme Area */}
        <div className="nav-auth">
          <ThemeSelector />

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div className="user-pill">
                <User size={15} color="var(--accent-gold)" />
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || user?.email}
                </span>
                <span className={`role-badge ${isAdmin ? 'admin' : 'customer'}`}>
                  {user?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Sign Out"
                style={{ padding: '0.45rem 0.75rem' }}
              >
                <LogOut size={15} />
                <span style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '6px',
              color: 'var(--text-primary)'
            }}
            className="mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem'
        }}>
          <Link to="/" onClick={closeMenu} className="nav-link">
            <Compass size={18} />
            <span>Explore</span>
          </Link>
          <Link to="/movies" onClick={closeMenu} className="nav-link">
            <Film size={18} />
            <span>Movies</span>
          </Link>
          {isAuthenticated && !isAdmin && (
            <Link to="/my-bookings" onClick={closeMenu} className="nav-link">
              <Ticket size={18} />
              <span>My Tickets</span>
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" onClick={closeMenu} className="nav-link">
              <LayoutDashboard size={18} />
              <span>Admin Console</span>
            </Link>
          )}

          <ThemeSelector compact={true} />
        </div>
      )}
    </nav>
  );
};
