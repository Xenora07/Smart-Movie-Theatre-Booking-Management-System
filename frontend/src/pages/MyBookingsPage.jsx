import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Printer,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Film,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'CONFIRMED', 'CANCELLED'

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load booking history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm(`Are you sure you want to cancel BOOKING #${bookingId}? Your seats will be released back to the show availability and payment marked REFUNDED.`)) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await bookingService.cancelBooking(bookingId);
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'CONFIRMED') return b.status === 'CONFIRMED';
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-gold)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
            <Ticket size={16} />
            <span>Customer Reservations</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            My Reserved Tickets
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Access verified digital tickets, print passes, and manage seat reservations
          </p>
        </div>

        <Link to="/movies" className="btn btn-primary btn-sm">
          <span>+ Book Another Film</span>
        </Link>
      </div>

      <ErrorMessage message={error} onRetry={fetchBookings} />

      {/* Tabs Filter */}
      {bookings.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '0.6rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.6rem',
          marginBottom: '2rem'
        }}>
          {[
            { id: 'ALL', label: `All Tickets (${bookings.length})` },
            { id: 'CONFIRMED', label: `Active & Confirmed (${bookings.filter((b) => b.status === 'CONFIRMED').length})` },
            { id: 'CANCELLED', label: `Cancelled (${bookings.filter((b) => b.status === 'CANCELLED').length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 700,
                backgroundColor: activeTab === tab.id ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent-gold)' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: activeTab === tab.id ? 'rgba(245, 158, 11, 0.4)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Retrieving customer reservations from database..." />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title={activeTab === 'ALL' ? 'No ticket bookings yet' : `No ${activeTab.toLowerCase()} bookings found`}
          description={
            activeTab === 'ALL'
              ? 'You have not reserved any movie tickets yet. Browse our current catalogue to pick your favourite seats!'
              : `You have no bookings matching the "${activeTab}" filter.`
          }
          action={
            <Link to="/movies" className="btn btn-primary">
              Explore Now Showing Movies
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
          {filteredBookings.map((b) => {
            const isConfirmed = b.status === 'CONFIRMED';
            const isCancelled = b.status === 'CANCELLED';
            const paymentStatus = b.payment?.paymentStatus || 'N/A';

            return (
              <div
                key={b.bookingId}
                className="card-box"
                style={{
                  padding: '1.8rem',
                  borderLeft: isConfirmed ? '4px solid var(--color-success-text)' : isCancelled ? '4px solid var(--accent-red)' : '4px solid var(--accent-gold)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem'
                }}
              >
                {/* Header row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.8rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '0.9rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                      BOOKING #{b.bookingId}
                    </span>
                    <span className={`badge ${isConfirmed ? 'badge-confirmed' : isCancelled ? 'badge-cancelled' : 'badge-pending'}`}>
                      {b.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Booked on: {b.bookingDate ? new Date(b.bookingDate).toLocaleString() : 'Recent'}
                  </div>
                </div>

                {/* Body details */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}>
                  {/* Film Details */}
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      {b.movieTitle}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                      <MapPin size={14} color="var(--accent-gold)" />
                      <span>{b.theatreName} — {b.screenName}</span>
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.3rem' }}>
                      <Calendar size={15} />
                      <span>{b.showDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                      <Clock size={15} />
                      <span>{b.showTime ? b.showTime.slice(0, 5) : ''}</span>
                    </div>
                  </div>

                  {/* Seats Allocated */}
                  <div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Seats ({b.bookedSeats?.length || 0}):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {b.bookedSeats && b.bookedSeats.length > 0 ? (
                        b.bookedSeats.map((s) => (
                          <span
                            key={s.seatId}
                            style={{
                              padding: '2px 8px',
                              backgroundColor: 'rgba(255, 255, 255, 0.06)',
                              borderRadius: '4px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: isCancelled ? 'var(--text-muted)' : 'var(--accent-gold)',
                              textDecoration: isCancelled ? 'line-through' : 'none'
                            }}
                          >
                            {s.seatNumber} ({s.seatType})
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-faint)' }}>
                          {isCancelled ? 'Released back to show' : 'None'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Payment */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                      ₹{Number(b.totalAmount).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.78rem', marginTop: '2px' }}>
                      <span className={`badge ${paymentStatus === 'SUCCESS' ? 'badge-success' : paymentStatus === 'REFUNDED' ? 'badge-refunded' : 'badge-failed'}`}>
                        {paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.8rem',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.9rem'
                }}>
                  <div style={{ fontSize: '0.82rem', color: isCancelled ? 'var(--color-error-text)' : 'var(--color-success-text)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {isCancelled ? (
                      <>
                        <XCircle size={15} />
                        <span>Seats released back to available inventory. Payment refunded.</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} />
                        <span>Valid for admission at theatre gate.</span>
                      </>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Link
                      to={`/confirmation/${b.bookingId}`}
                      className="btn btn-secondary btn-sm"
                    >
                      <Printer size={14} />
                      <span>View &amp; Print Ticket</span>
                    </Link>

                    {isConfirmed && (
                      <button
                        onClick={() => handleCancelBooking(b.bookingId)}
                        disabled={cancellingId === b.bookingId}
                        className="btn btn-danger btn-sm"
                      >
                        {cancellingId === b.bookingId ? (
                          <span>Releasing Seats...</span>
                        ) : (
                          <>
                            <XCircle size={14} />
                            <span>Cancel Booking</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
