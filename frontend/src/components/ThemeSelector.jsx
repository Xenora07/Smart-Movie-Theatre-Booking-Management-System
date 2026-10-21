import React, { useState, useRef, useEffect } from 'react';
import { useTheme, THEMES, MODES } from '../context/ThemeContext';
import { Sun, Moon, Palette, Check, Sparkles } from 'lucide-react';

export const ThemeSelector = ({ compact = false }) => {
  const { mode, lightTheme, isDark, isLight, toggleMode, setMode, setLightTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  const handleSelectCinema = () => {
    setLightTheme(THEMES.CINEMA);
    // If user explicitly chooses Cinema from the palette, switch to Light mode so it's instantly visible
    if (isDark) setMode(MODES.LIGHT);
    setDropdownOpen(false);
  };

  const handleSelectBlue = () => {
    setLightTheme(THEMES.BLUE);
    // If user explicitly chooses Blue from the palette, switch to Light mode so it's instantly visible
    if (isDark) setMode(MODES.LIGHT);
    setDropdownOpen(false);
  };

  // If rendered in mobile menu drawer in compact inline mode
  if (compact) {
    return (
      <div style={{
        padding: '0.8rem 0',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '0.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.6rem'
        }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Appearance &amp; Theme
          </span>
          <button
            onClick={toggleMode}
            className="btn btn-secondary btn-sm"
            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button
            onClick={() => { setLightTheme(THEMES.CINEMA); if (isDark) setMode(MODES.LIGHT); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${lightTheme === THEMES.CINEMA && isLight ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
              backgroundColor: lightTheme === THEMES.CINEMA && isLight ? 'rgba(181, 18, 43, 0.12)' : 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#B5122B', display: 'inline-block' }} />
            <span>Cinema (Red)</span>
          </button>

          <button
            onClick={() => { setLightTheme(THEMES.BLUE); if (isDark) setMode(MODES.LIGHT); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${lightTheme === THEMES.BLUE && isLight ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
              backgroundColor: lightTheme === THEMES.BLUE && isLight ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2563EB', display: 'inline-block' }} />
            <span>Blue (Original)</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop / Header selector
  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      {/* 1-Click Dark/Light Mode Toggle */}
      <button
        onClick={toggleMode}
        className="theme-mode-toggle"
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle Light/Dark Mode"
        style={{
          width: '34px',
          height: '34px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          color: isDark ? 'var(--accent-gold)' : 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'var(--transition-fast)'
        }}
      >
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      {/* Theme Palette Dropdown Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="theme-dropdown-trigger"
        aria-expanded={dropdownOpen}
        aria-haspopup="menu"
        title="Choose Visual Theme"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.45rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          color: 'var(--text-primary)',
          fontSize: '0.82rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'var(--transition-fast)'
        }}
      >
        <Palette size={15} style={{ color: isDark ? 'var(--accent-gold)' : lightTheme === THEMES.CINEMA ? '#B5122B' : '#2563EB' }} />
        <span>
          {isDark
            ? 'Dark'
            : lightTheme === THEMES.CINEMA
            ? 'Cinema'
            : 'Blue'}
        </span>
        {/* Active Theme Color Swatch Pill */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
          marginLeft: '2px'
        }}>
          {isDark ? (
            <>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#0a0d14', border: '1px solid #475569' }} />
            </>
          ) : lightTheme === THEMES.CINEMA ? (
            <>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#B5122B' }} />
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#F8BD3D' }} />
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#FBE2DE', border: '1px solid #B5122B' }} />
            </>
          ) : (
            <>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#2563EB' }} />
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#60A5FA' }} />
            </>
          )}
        </span>
      </button>

      {/* Floating Theme Menu Popover */}
      {dropdownOpen && (
        <div
          role="menu"
          className="theme-menu-popover"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '290px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg), 0 10px 30px rgba(0, 0, 0, 0.25)',
            padding: '1rem',
            zIndex: 300,
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '0.6rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '0.8rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Palette size={14} />
              <span>Theme &amp; Appearance</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontWeight: 600 }}>Instant Switch</span>
          </div>

          {/* Mode Switcher */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Base Mode
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.4rem',
              backgroundColor: 'var(--bg-secondary)',
              padding: '4px',
              borderRadius: 'var(--radius-sm)'
            }}>
              <button
                onClick={() => setMode(MODES.DARK)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: isDark ? '1px solid var(--border-accent)' : 'none',
                  backgroundColor: isDark ? 'var(--bg-surface)' : 'transparent',
                  color: isDark ? 'var(--accent-gold)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <Moon size={14} />
                <span>Dark</span>
              </button>

              <button
                onClick={() => setMode(MODES.LIGHT)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: isLight ? '1px solid var(--border-accent)' : 'none',
                  backgroundColor: isLight ? 'var(--bg-surface)' : 'transparent',
                  color: isLight ? 'var(--accent-gold)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <Sun size={14} />
                <span>Light</span>
              </button>
            </div>
          </div>

          {/* Light Theme Styles */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Light Theme Palette
              </span>
              {isDark && (
                <span style={{ fontSize: '0.68rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>
                  Active in Light Mode
                </span>
              )}
            </div>

            {/* Option 1: Cinema Theme (Red & Cream) */}
            <button
              onClick={handleSelectCinema}
              role="menuitem"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '0.7rem',
                borderRadius: 'var(--radius-sm)',
                border: `1.5px solid ${lightTheme === THEMES.CINEMA ? '#B5122B' : 'var(--border-subtle)'}`,
                backgroundColor: lightTheme === THEMES.CINEMA ? 'rgba(181, 18, 43, 0.08)' : 'var(--bg-secondary)',
                marginBottom: '0.5rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.95rem' }}>🎟️</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Cinema — Red &amp; Cream
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                  Vintage poster aesthetic from DBMS slides with deep red, warm cream &amp; blush pink
                </div>
                {/* Palette Swatches */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                  <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#B5122B', border: '1px solid rgba(0,0,0,0.1)' }} title="Primary Red" />
                  <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#FFF6F2', border: '1px solid rgba(0,0,0,0.15)' }} title="Warm Cream" />
                  <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#FBE2DE', border: '1px solid rgba(0,0,0,0.15)' }} title="Blush Pink" />
                  <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#F8BD3D', border: '1px solid rgba(0,0,0,0.1)' }} title="Golden Yellow" />
                </div>
              </div>
              {lightTheme === THEMES.CINEMA && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#B5122B',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </button>

            {/* Option 2: Blue Theme (Original) */}
            <button
              onClick={handleSelectBlue}
              role="menuitem"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '0.7rem',
                borderRadius: 'var(--radius-sm)',
                border: `1.5px solid ${lightTheme === THEMES.BLUE ? '#2563EB' : 'var(--border-subtle)'}`,
                backgroundColor: lightTheme === THEMES.BLUE ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-secondary)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.95rem' }}>🟦</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Blue — Original
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                  Clean modern light theme in crisp slate and sapphire blue accents
                </div>
                {/* Palette Swatches */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                  <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#2563EB', border: '1px solid rgba(0,0,0,0.1)' }} title="Sapphire Blue" />
                  <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#F8FAFC', border: '1px solid rgba(0,0,0,0.15)' }} title="Slate White" />
                  <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#F1F5F9', border: '1px solid rgba(0,0,0,0.15)' }} title="Light Surface" />
                  <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#60A5FA', border: '1px solid rgba(0,0,0,0.1)' }} title="Sky Blue" />
                </div>
              </div>
              {lightTheme === THEMES.BLUE && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#2563EB',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
