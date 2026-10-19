import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { MoviePoster } from '../components/MoviePoster';
import { MovieSkeletonGrid } from '../components/MovieSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import {
  Star,
  Clock,
  Clapperboard,
  Ticket,
  ChevronRight,
  MapPin,
  Sparkles,
  Film,
  Building2,
  ShieldCheck,
  Armchair
} from 'lucide-react';

export const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [moviesData, theatresData] = await Promise.all([
        movieService.getAllMovies(),
        movieService.getAllTheatres().catch(() => [])
      ]);
      setMovies(moviesData || []);
      setTheatres(theatresData || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load movie catalogue from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Featured film for the hero banner (defaults to highest rated or first film)
  const featuredMovies = movies.length > 0 ? movies.slice(0, 3) : [];
  const currentHero = featuredMovies[activeHeroIndex] || movies[0];

  // Divide movies into "Now Showing" and "Coming Soon / Spotlight"
  const nowShowing = movies.slice(0, 4);
  const comingSoon = movies.slice(4);

  return (
    <div>
      {/* 1. Large Cinematic Hero Banner */}
      {currentHero && (
        <div className="hero-banner">
          {currentHero.posterUrl && (
            <div
              className="hero-backdrop"
              style={{
                backgroundImage: `url(${currentHero.posterUrl})`
              }}
            />
          )}
          <div className="hero-overlay" />

          <div className="hero-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <span className="hero-badge">
                <Sparkles size={14} />
                Featured Premiere
              </span>
              <span style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600
              }}>
                IMAX 4K • Dolby Atmos
              </span>
            </div>

            <h1 className="hero-title">
              {currentHero.title}
            </h1>

            <p className="hero-desc">
              {currentHero.description ||
                'Experience breathtaking cinematic brilliance with state-of-the-art projection and immersive acoustic sound engineering.'}
            </p>

            <div className="hero-meta-row">
              <div className="hero-meta-item" style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>
                <Star size={16} fill="var(--accent-gold)" />
                <span>{currentHero.rating ? `${Number(currentHero.rating).toFixed(1)} / 10` : '8.0+'}</span>
              </div>
              <div className="hero-meta-item">
                <Clock size={16} />
                <span>{currentHero.durationMinutes} mins</span>
              </div>
              <div className="hero-meta-item">
                <Film size={16} />
                <span>{currentHero.genre}</span>
              </div>
              <div className="hero-meta-item">
                <span>{currentHero.language}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <Link to={`/movies/${currentHero.movieId}`} className="btn btn-primary btn-lg">
                <Ticket size={18} />
                <span>Book Tickets</span>
              </Link>
              <Link to="/movies" className="btn btn-secondary btn-lg">
                <span>Explore Movies</span>
                <ChevronRight size={18} />
              </Link>
            </div>

            {/* Hero Quick Switcher Dots if multiple featured movies */}
            {featuredMovies.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
                {featuredMovies.map((m, idx) => (
                  <button
                    key={m.movieId}
                    onClick={() => setActiveHeroIndex(idx)}
                    style={{
                      width: activeHeroIndex === idx ? '28px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: activeHeroIndex === idx ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.25)',
                      transition: 'all 0.3s ease'
                    }}
                    aria-label={`Switch to ${m.title}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <ErrorMessage message={error} onRetry={fetchData} />

      {/* 2. Now Showing Section */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '1.8rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
              <Clapperboard size={16} />
              <span>In Theatres Today</span>
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff' }}>
              Now Showing
            </h2>
          </div>
          <Link to="/movies" className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-gold)' }}>
            View Full Catalogue ({movies.length})
            <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <MovieSkeletonGrid count={4} />
        ) : (
          <div className="movie-grid">
            {nowShowing.map((movie) => (
              <div key={movie.movieId} className="movie-card">
                <div className="poster-wrapper">
                  <MoviePoster
                    src={movie.posterUrl}
                    alt={movie.title}
                    title={movie.title}
                    genre={movie.genre}
                  />
                  {movie.rating && (
                    <div className="rating-badge">
                      <Star size={13} fill="currentColor" />
                      <span>{Number(movie.rating).toFixed(1)}</span>
                    </div>
                  )}
                  <div className="poster-overlay">
                    <Link
                      to={`/movies/${movie.movieId}`}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', padding: '0.6rem' }}
                    >
                      <Ticket size={15} />
                      <span>Select Seats</span>
                    </Link>
                  </div>
                </div>

                <div className="card-body">
                  <h3 className="movie-title" title={movie.title}>
                    {movie.title}
                  </h3>
                  <div className="movie-meta">
                    <span>{movie.genre}</span>
                    <span>•</span>
                    <span>{movie.durationMinutes}m</span>
                    <span>•</span>
                    <span>{movie.language}</span>
                  </div>
                  <Link
                    to={`/movies/${movie.movieId}`}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 'auto', width: '100%' }}
                  >
                    View Showtimes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Coming Soon / Spotlight Section */}
      {comingSoon.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.8rem' }}>
            <div>
              <div style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                Upcoming Releases
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff' }}>
                Coming Soon
              </h2>
            </div>
          </div>

          <div className="movie-grid">
            {comingSoon.map((movie) => (
              <div key={movie.movieId} className="movie-card">
                <div className="poster-wrapper">
                  <MoviePoster
                    src={movie.posterUrl}
                    alt={movie.title}
                    title={movie.title}
                    genre={movie.genre}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: 'rgba(234, 88, 12, 0.9)',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}>
                    Advance Booking
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-meta">
                    <span>{movie.genre}</span>
                    <span>•</span>
                    <span>{movie.language}</span>
                  </div>
                  <Link
                    to={`/movies/${movie.movieId}`}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 'auto', width: '100%' }}
                  >
                    Explore Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Theatres & Venues Near You */}
      {theatres.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ marginBottom: '1.8rem' }}>
            <div style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
              Cinema Locations
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff' }}>
              Popular Theatres Near You
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.4rem'
          }}>
            {theatres.map((t) => (
              <div key={t.theatreId} className="card-box hoverable" style={{ padding: '1.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(245, 158, 11, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)'
                  }}>
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                      {t.theatreName}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <MapPin size={14} />
                      <span>{t.location}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.8rem',
                  marginTop: '0.8rem'
                }}>
                  <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '3px 8px', borderRadius: '4px' }}>
                    Dolby 7.1
                  </span>
                  <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '3px 8px', borderRadius: '4px' }}>
                    Laser 4K
                  </span>
                  <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '3px 8px', borderRadius: '4px' }}>
                    Luxury Recliners
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. CineWave VIP Experience Callout */}
      <section className="card-box card-box-glow" style={{
        padding: '2.5rem',
        background: 'linear-gradient(135deg, rgba(22, 29, 45, 0.9) 0%, rgba(13, 18, 28, 0.95) 100%)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)',
            flexShrink: 0
          }}>
            <Armchair size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.3rem' }}>
              Multi-Tier Luxury Seating
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5 }}>
              Choose between Regular, Premium acoustic sweet-spot, and ultra-plush motorized Recliners.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-green)',
            flexShrink: 0
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.3rem' }}>
              Zero Double-Booking
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5 }}>
              Guaranteed ACID transactional locks with physical composite uniqueness constraints in MySQL 8.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-blue)',
            flexShrink: 0
          }}>
            <Ticket size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.3rem' }}>
              Instant Digital Boarding Pass
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5 }}>
              Receive a verifiable cinema receipt with seat breakdown, barcode, and one-click cancellation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
