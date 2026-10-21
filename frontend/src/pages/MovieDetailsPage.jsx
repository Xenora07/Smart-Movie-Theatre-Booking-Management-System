import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { MoviePoster } from '../components/MoviePoster';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import {
  Star,
  Clock,
  Film,
  Calendar,
  MapPin,
  Building2,
  Ticket,
  ChevronLeft,
  Sparkles,
  Monitor
} from 'lucide-react';

export const MovieDetailsPage = () => {
  const { movieId: rawMovieId, id: rawId } = useParams();
  const movieId = rawMovieId || rawId;
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShowId, setSelectedShowId] = useState(null);

  const loadData = async () => {
    if (!movieId || isNaN(Number(movieId))) {
      setError('Invalid or missing movie ID. Please return to the catalogue and select a valid title.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [movieData, showsData] = await Promise.all([
        movieService.getMovieById(movieId),
        movieService.getShowsForMovie(movieId)
      ]);
      setMovie(movieData);
      setShows(showsData || []);
      if (showsData && showsData.length > 0) {
        setSelectedDate(showsData[0].showDate);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load movie details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [movieId]);

  if (loading) {
    return <LoadingSpinner text="Retrieving film details and screen schedules..." />;
  }

  if (error || !movie) {
    return <ErrorMessage message={error || 'Movie not found.'} onRetry={loadData} />;
  }

  // Get distinct dates
  const distinctDates = [...new Set(shows.map((s) => s.showDate))].sort();

  // Shows filtered by selected date
  const filteredShows = shows.filter((s) => s.showDate === selectedDate);

  // Group shows by Theatre
  const showsByTheatre = filteredShows.reduce((acc, show) => {
    const theatreKey = `${show.theatreName}###${show.theatreLocation || ''}###${show.theatreId}`;
    if (!acc[theatreKey]) {
      acc[theatreKey] = [];
    }
    acc[theatreKey].push(show);
    return acc;
  }, {});

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.round((dateObj - today) / (1000 * 60 * 60 * 24));
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dayMonth = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    if (diffDays === 0) return { primary: 'Today', secondary: dayMonth };
    if (diffDays === 1) return { primary: 'Tomorrow', secondary: dayMonth };
    return { primary: weekday, secondary: dayMonth };
  };

  const handleSelectShow = (showId) => {
    setSelectedShowId(showId);
  };

  const handleProceedToSeats = () => {
    if (selectedShowId) {
      navigate(`/shows/${selectedShowId}/seats`);
    }
  };

  return (
    <div>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/movies" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
          <ChevronLeft size={18} />
          <span>Back to Movie Catalogue</span>
        </Link>
      </div>

      {/* Cinematic Movie Details Showcase */}
      <div className="card-box" style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '2.5rem',
        marginBottom: '3rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Subtle Backdrop Blur if available */}
        {movie.posterUrl && (
          <div
            className="movie-details-backdrop"
            style={{
              backgroundImage: `url(${movie.posterUrl})`
            }}
          />
        )}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'flex-start' }}>
          {/* Poster Column */}
          <div style={{
            width: '240px',
            flexShrink: 0,
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg), 0 0 24px rgba(0,0,0,0.8)',
            border: '1px solid var(--border-light)',
            aspectRatio: '2 / 3'
          }}>
            <MoviePoster
              src={movie.posterUrl}
              alt={movie.title}
              title={movie.title}
              genre={movie.genre}
            />
          </div>

          {/* Details Column */}
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span className="hero-badge">
                <Sparkles size={14} />
                Now in Theatres
              </span>
              <span style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600
              }}>
                UA • 2D / 3D / IMAX
              </span>
            </div>

            <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '0.8rem' }}>
              {movie.title}
            </h1>

            {/* Meta Row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.2rem',
              marginBottom: '1.4rem',
              fontSize: '0.92rem',
              color: 'var(--text-secondary)'
            }}>
              {movie.rating && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--accent-gold)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 800,
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                  <Star size={16} fill="var(--accent-gold)" />
                  <span>{Number(movie.rating).toFixed(1)} / 10</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} />
                <span>{movie.durationMinutes} mins</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Film size={16} />
                <span>{movie.genre}</span>
              </div>
              <div>
                <span>Language: <strong>{movie.language}</strong></span>
              </div>
            </div>

            {/* Synopsis */}
            <div style={{ marginBottom: '1.8rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Synopsis
              </h3>
              <p style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.7 }}>
                {movie.description || 'No detailed synopsis available for this title.'}
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '2rem',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '1.2rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}>
              <div>
                <span>Screen Formats:</span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                  4K Laser, Dolby Atmos, RealD 3D
                </div>
              </div>
              <div>
                <span>Audio:</span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                  Dolby Surround 7.1
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shows & Booking Section */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
            Live Cinema Schedules
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Select Date &amp; Showtime
          </h2>
        </div>

        {distinctDates.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No showtimes currently scheduled"
            description="Our cinema management team hasn't scheduled active screenings for this title yet. Check back soon or explore other movies."
            action={
              <Link to="/movies" className="btn btn-secondary">
                Explore Other Movies
              </Link>
            }
          />
        ) : (
          <>
            {/* Interactive Date Tabs */}
            <div style={{
              display: 'flex',
              gap: '0.8rem',
              overflowX: 'auto',
              paddingBottom: '0.6rem',
              marginBottom: '2rem'
            }}>
              {distinctDates.map((d) => {
                const label = formatDateLabel(d);
                const isSelected = selectedDate === d;
                return (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDate(d);
                      setSelectedShowId(null);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.75rem 1.4rem',
                      minWidth: '100px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--accent-gold)' : 'var(--bg-surface)',
                      color: isSelected ? 'var(--accent-contrast)' : 'var(--text-primary)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent-gold)' : 'var(--border-subtle)',
                      boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      {label.primary}
                    </span>
                    <span style={{ fontSize: '0.75rem', opacity: isSelected ? 0.9 : 0.6, marginTop: '2px' }}>
                      {label.secondary}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Theatres and Showtimes Grouped List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {Object.keys(showsByTheatre).map((theatreKey) => {
                const [theatreName, theatreLocation] = theatreKey.split('###');
                const theatreShows = showsByTheatre[theatreKey];

                return (
                  <div key={theatreKey} className="card-box" style={{ padding: '1.8rem' }}>
                    {/* Theatre Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.8rem',
                      marginBottom: '1.2rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      paddingBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(245, 158, 11, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-gold)'
                        }}>
                          <Building2 size={20} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {theatreName}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            <MapPin size={13} />
                            <span>{theatreLocation || 'Auditorium Complex'}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '3px 8px', borderRadius: '4px' }}>
                          M-Ticket Available
                        </span>
                        <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '3px 8px', borderRadius: '4px' }}>
                          F&amp;B Counter
                        </span>
                      </div>
                    </div>

                    {/* Showtimes Pill Buttons */}
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                        Available Showtimes:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                        {theatreShows.map((s) => {
                          const isShowSelected = selectedShowId === s.showId;
                          const formattedTime = s.showTime ? s.showTime.slice(0, 5) : '';

                          return (
                            <button
                              key={s.showId}
                              type="button"
                              onClick={() => handleSelectShow(s.showId)}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '0.7rem 1.2rem',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: isShowSelected ? 'var(--grad-primary)' : 'var(--bg-secondary)',
                                color: isShowSelected ? 'var(--accent-contrast)' : 'var(--text-primary)',
                                border: '1px solid',
                                borderColor: isShowSelected ? 'var(--accent-gold)' : 'var(--border-light)',
                                boxShadow: isShowSelected ? 'var(--shadow-glow)' : 'none',
                                transition: 'all 0.2s ease',
                                minWidth: '105px'
                              }}
                            >
                              <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                                {formattedTime}
                              </span>
                              <span style={{
                                fontSize: '0.72rem',
                                color: isShowSelected ? 'var(--accent-contrast)' : 'var(--accent-gold)',
                                opacity: isShowSelected ? 0.95 : 1,
                                fontWeight: 700,
                                marginTop: '2px'
                              }}>
                                ₹{Number(s.price).toFixed(0)} Base
                              </span>
                              <span style={{
                                fontSize: '0.68rem',
                                color: isShowSelected ? 'var(--accent-contrast)' : 'var(--text-muted)',
                                opacity: isShowSelected ? 0.85 : 1,
                                marginTop: '1px'
                              }}>
                                {s.screenName}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Persistent Selection Bar */}
            {selectedShowId && (
              <div
                className="selected-show-banner"
                style={{
                  marginTop: '2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
                    Showtime Selected
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {shows.find((s) => s.showId === selectedShowId)?.theatreName} — {shows.find((s) => s.showId === selectedShowId)?.showTime?.slice(0, 5)}
                  </div>
                </div>

                <button onClick={handleProceedToSeats} className="btn btn-primary btn-lg">
                  <Ticket size={18} />
                  <span>Select Your Seats</span>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
