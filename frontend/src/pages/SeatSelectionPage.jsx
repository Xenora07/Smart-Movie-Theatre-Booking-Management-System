import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import {
  Ticket,
  ChevronLeft,
  RefreshCw,
  Armchair,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';

export const SeatSelectionPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadShowAndSeats = async () => {
    if (!showId || isNaN(Number(showId))) {
      setError('Invalid show ID. Please return to the movie details page and select a showtime.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [showData, seatsData] = await Promise.all([
        movieService.getShowById(showId),
        movieService.getSeatsForShow(showId)
      ]);
      setShow(showData);
      setSeats(seatsData || []);

      // Filter out any seats that are now booked
      setSelectedSeatIds((prev) =>
        prev.filter((id) => {
          const s = (seatsData || []).find((seat) => seat.seatId === id);
          return s && s.available;
        })
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load show seat layout.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShowAndSeats();
  }, [showId]);

  const toggleSeat = (seat) => {
    if (!seat.available) return;

    setSelectedSeatIds((prev) =>
      prev.includes(seat.seatId)
        ? prev.filter((id) => id !== seat.seatId)
        : [...prev, seat.seatId]
    );
  };

  const getSeatMultiplier = (seatType) => {
    if (seatType === 'RECLINER') return 1.5;
    if (seatType === 'PREMIUM') return 1.2;
    return 1.0;
  };

  const handleProceedToBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/shows/${showId}/seats` } } });
      return;
    }

    if (selectedSeatIds.length === 0) {
      setError('Please select at least one seat to proceed.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const booking = await bookingService.createBooking(Number(showId), selectedSeatIds);
      navigate(`/checkout/${booking.bookingId}`);
    } catch (err) {
      if (err.response?.status === 409) {
        setError(err.response?.data?.message || 'One or more selected seats were just reserved by another customer. Seat availability has been refreshed.');
        await loadShowAndSeats();
      } else {
        setError(err.response?.data?.message || 'Failed to create booking.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Rendering interactive cinema auditorium map..." />;
  }

  if (!show) {
    return <ErrorMessage message={error || 'Show details could not be loaded.'} onRetry={loadShowAndSeats} />;
  }

  // Group seats by Row letter
  const rows = {};
  seats.forEach((seat) => {
    const rowLetter = seat.seatNumber.charAt(0);
    if (!rows[rowLetter]) rows[rowLetter] = [];
    rows[rowLetter].push(seat);
  });

  // Calculate pricing breakdown
  const selectedSeatsList = selectedSeatIds
    .map((id) => seats.find((s) => s.seatId === id))
    .filter(Boolean);

  const estimatedTotal = selectedSeatsList
    .reduce((sum, seat) => {
      const mult = getSeatMultiplier(seat.seatType);
      return sum + Number(show.price) * mult;
    }, 0)
    .toFixed(2);

  return (
    <div>
      {/* Back button */}
      <div style={{ marginBottom: '1.2rem' }}>
        <Link to={`/movies/${show.movieId}`} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
          <ChevronLeft size={18} />
          <span>Back to Film Showtimes</span>
        </Link>
      </div>

      {/* Show Header Summary */}
      <div className="card-box" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.2rem',
        marginBottom: '2rem',
        padding: '1.6rem 2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
            <MapPin size={14} />
            <span>{show.theatreName} — {show.screenName}</span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {show.movieTitle}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={15} />
              {show.showDate}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={15} />
              {show.showTime ? show.showTime.slice(0, 5) : ''}
            </span>
            <span>•</span>
            <span>Standard Base Rate: <strong style={{ color: 'var(--accent-gold)' }}>₹{Number(show.price).toFixed(2)}</strong></span>
          </div>
        </div>

        <button
          onClick={loadShowAndSeats}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <RefreshCw size={14} />
          <span>Refresh Availability</span>
        </button>
      </div>

      <ErrorMessage message={error} />

      {/* Cinema Screen & Seat Layout Box */}
      <div className="card-box" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
        {/* Cinema Curved Screen Visual with Projection Beam */}
        <div className="screen-container">
          <div className="screen-beam" />
          <div className="screen-curve" />
          <div className="screen-label">AUDITORIUM PROJECTION SCREEN THIS WAY</div>
        </div>

        {/* Seat Matrix Rows */}
        <div className="seat-matrix">
          {Object.keys(rows).sort().map((rowLetter) => (
            <div key={rowLetter} className="seat-row">
              <span className="seat-row-label">
                {rowLetter}
              </span>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {rows[rowLetter].map((seat) => {
                  const isSelected = selectedSeatIds.includes(seat.seatId);
                  const isBooked = !seat.available;
                  const typeClass = seat.seatType.toLowerCase();

                  return (
                    <button
                      key={seat.seatId}
                      type="button"
                      disabled={isBooked}
                      onClick={() => toggleSeat(seat)}
                      title={`Seat ${seat.seatNumber} (${seat.seatType}) • ₹${(Number(show.price) * getSeatMultiplier(seat.seatType)).toFixed(0)} • ${isBooked ? 'Already Booked' : 'Available'}`}
                      className={`seat-cell ${typeClass} ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                      aria-label={`Seat ${seat.seatNumber} ${seat.seatType} ${isBooked ? 'Unavailable' : isSelected ? 'Selected' : 'Available'}`}
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Seat Legend with Multiplier Prices */}
        <div className="seat-legend">
          <div className="legend-item">
            <div className="seat-cell regular legend-swatch" />
            <span>Regular (₹{Number(show.price).toFixed(0)})</span>
          </div>
          <div className="legend-item">
            <div className="seat-cell premium legend-swatch" />
            <span>Premium (₹{(Number(show.price) * 1.2).toFixed(0)})</span>
          </div>
          <div className="legend-item">
            <div className="seat-cell recliner legend-swatch" />
            <span>Recliner (₹{(Number(show.price) * 1.5).toFixed(0)})</span>
          </div>
          <div className="legend-item">
            <div className="seat-cell selected legend-swatch" />
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="seat-cell booked legend-swatch" />
            <span>Booked (Unavailable)</span>
          </div>
        </div>
      </div>

      {/* Floating Booking Checkout Summary Bar */}
      <div
        className="selected-show-banner"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          marginTop: '2rem'
        }}
      >
        {/* Selected Seats summary */}
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            Selected Seats ({selectedSeatIds.length})
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {selectedSeatsList.length > 0 ? (
              selectedSeatsList.map((s) => `${s.seatNumber} (${s.seatType.slice(0, 3)})`).join(', ')
            ) : (
              <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.95rem' }}>
                Please tap on available seats to select
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Proceed CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Estimated Total
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              ₹{estimatedTotal}
            </div>
          </div>

          <button
            type="button"
            disabled={selectedSeatIds.length === 0 || submitting}
            onClick={handleProceedToBooking}
            className="btn btn-primary btn-lg"
          >
            {submitting ? (
              <span>Reserving Seats...</span>
            ) : (
              <>
                <Ticket size={18} />
                <span>Confirm Seats &amp; Pay</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
