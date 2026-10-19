import React, { useState } from 'react';
import { Film } from 'lucide-react';

export const MoviePoster = ({ src, alt, className = '', title, genre }) => {
  const [hasError, setHasError] = useState(!src);

  if (hasError || !src) {
    return (
      <div className={`poster-fallback ${className}`}>
        <Film className="fallback-icon" />
        <span className="fallback-title">{title || alt || 'CineWave Film'}</span>
        {genre && (
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {genre}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || title || 'Movie Poster'}
      className={`poster-img ${className}`}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
};
