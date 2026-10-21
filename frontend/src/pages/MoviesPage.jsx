import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { MoviePoster } from '../components/MoviePoster';
import { MovieSkeletonGrid } from '../components/MovieSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { Search, Filter, Star, Clock, Ticket, X, Film, Sparkles } from 'lucide-react';

export const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [sortBy, setSortBy] = useState('TITLE');

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await movieService.getAllMovies();
      setMovies(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch movies from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const genres = ['ALL', ...new Set(movies.map((m) => m.genre).filter(Boolean))];
  const languages = ['ALL', ...new Set(movies.map((m) => m.language).filter(Boolean))];

  const filteredMovies = movies
    .filter((m) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        m.title.toLowerCase().includes(query) ||
        m.description?.toLowerCase().includes(query) ||
        m.genre?.toLowerCase().includes(query);
      const matchesGenre = selectedGenre === 'ALL' || m.genre === selectedGenre;
      const matchesLanguage = selectedLanguage === 'ALL' || m.language === selectedLanguage;
      return matchesSearch && matchesGenre && matchesLanguage;
    })
    .sort((a, b) => {
      if (sortBy === 'RATING') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'DURATION') return (b.durationMinutes || 0) - (a.durationMinutes || 0);
      return a.title.localeCompare(b.title);
    });

  const clearFilters = () => {
    setSearch('');
    setSelectedGenre('ALL');
    setSelectedLanguage('ALL');
    setSortBy('TITLE');
  };

  const hasActiveFilters = search || selectedGenre !== 'ALL' || selectedLanguage !== 'ALL' || sortBy !== 'TITLE';

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
          <Film size={16} />
          <span>Cinematic Catalogue</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Explore Movies
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Discover the latest blockbusters, indie gems, and upcoming festival screenings.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-box" style={{
        padding: '1.4rem',
        marginBottom: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem'
      }}>
        {/* Top row: Search input + Sorting */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search Input */}
          <div style={{
            position: 'relative',
            flex: '1 1 300px',
            maxWidth: '520px'
          }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by title, genre, synopsis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: '42px',
                paddingRight: search ? '40px' : '14px',
                width: '100%',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)'
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="TITLE">Title (A - Z)</option>
              <option value="RATING">Highest Rating</option>
              <option value="DURATION">Longest Duration</option>
            </select>
          </div>
        </div>

        {/* Bottom row: Filter Chips for Genre and Language */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1.2rem',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1rem'
        }}>
          {/* Genre Chips */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginRight: '0.3rem' }}>
              Genre:
            </span>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backgroundColor: selectedGenre === genre ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                  color: selectedGenre === genre ? 'var(--accent-contrast)' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: selectedGenre === genre ? 'var(--accent-gold)' : 'var(--border-subtle)',
                  transition: 'all 0.2s ease'
                }}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Language:
            </span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }}
              >
                Reset All
              </button>
            )}
          </div>
        </div>
      </div>

      <ErrorMessage message={error} onRetry={fetchMovies} />

      {/* Movie Results Grid */}
      {loading ? (
        <MovieSkeletonGrid count={8} />
      ) : filteredMovies.length === 0 ? (
        <EmptyState
          title="No movies found"
          description={
            hasActiveFilters
              ? 'No movies match your current search and filter criteria. Try resetting filters to explore all titles.'
              : 'There are currently no active movies in the cinema catalogue.'
          }
          action={
            hasActiveFilters ? (
              <button onClick={clearFilters} className="btn btn-secondary">
                Clear Filters
              </button>
            ) : null
          }
        />
      ) : (
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
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
                    style={{ width: '100%', padding: '0.65rem' }}
                  >
                    <Ticket size={16} />
                    <span>Book Tickets</span>
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
                {movie.description && (
                  <p style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {movie.description}
                  </p>
                )}
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
    </div>
  );
};
