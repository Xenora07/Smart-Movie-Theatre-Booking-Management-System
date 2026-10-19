import React from 'react';

export const MovieSkeletonGrid = ({ count = 4 }) => {
  return (
    <div className="movie-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="movie-card" style={{ pointerEvents: 'none' }}>
          <div className="poster-wrapper skeleton" style={{ width: '100%', aspectRatio: '2/3' }} />
          <div className="card-body">
            <div className="skeleton" style={{ height: '18px', width: '75%', marginBottom: '0.6rem' }} />
            <div className="skeleton" style={{ height: '14px', width: '50%', marginBottom: '1rem' }} />
            <div className="skeleton" style={{ height: '32px', width: '100%', marginTop: 'auto' }} />
          </div>
        </div>
      ))}
    </div>
  );
};
