import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { MoviePoster } from '../components/MoviePoster';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import {
  CheckCircle2,
  Printer,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Film,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const ConfirmationPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId || isNaN(Number(bookingId))) {
        setError('Invalid booking ID. Please check your reservation reference.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await bookingService.getBookingById(bookingId);
        setBooking(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load booking confirmation.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <LoadingSpinner text="Generating digital cinema boarding pass..." />;
  }

  if (error || !booking) {
    return <ErrorMessage message={error || 'Booking details not found.'} />;
  }

  const handlePrint = () => {
    window.print();
  };

  const isConfirmed = booking.status === 'CONFIRMED';
  const paymentRef = booking.payment?.transactionRef || `SIM-TXN-${booking.bookingId * 8831}`;

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
      {/* Top Success Banner */}
      <div className="no-print" style={{ marginBottom: '2.5rem' }}>
        <div style={{
          width: '72px',
          height: '72px',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.2rem',
          color: 'var(--accent-green)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          boxShadow: '0 0 24px rgba(16, 185, 129, 0.25)'
        }}>
          <CheckCircle2 size={36} />
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
          Your cinema seats have been officially locked and recorded in MySQL 8.
        </p>
      </div>

      {/* Digital Cinema Ticket / Boarding Pass */}
      <div className="ticket-wrapper">
        <div className="ticket-card">
          {/* Main Stub */}
          <div className="ticket-main" style={{ textAlign: 'left' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px dashed rgba(255, 255, 255, 0.12)',
              paddingBottom: '1rem',
              marginBottom: '1.4rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  Cine<span style={{ color: 'var(--accent-gold)' }}>Wave</span>
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--accent-gold)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-xs)',
                  fontWeight: 800
                }}>
                  DIGITAL PASS
                </span>
              </div>
              <span className={`badge ${isConfirmed ? 'badge-confirmed' : 'badge-cancelled'}`}>
                {booking.status}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1.4rem', alignItems: 'flex-start', marginBottom: '1.6rem' }}>
              {booking.moviePosterUrl && (
                <div style={{
                  width: '75px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  aspectRatio: '2/3',
                  flexShrink: 0,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  <img
                    src={booking.moviePosterUrl}
                    alt={booking.movieTitle}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, marginBottom: '0.4rem' }}>
                  {booking.movieTitle}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <MapPin size={14} color="var(--accent-gold)" />
                  <span>{booking.theatreName} — {booking.screenName}</span>
                </div>
                <div style={{ color: 'var(--text-faint)', fontSize: '0.78rem', marginTop: '2px' }}>
                  {booking.theatreLocation || 'Auditorium Complex'}
                </div>
              </div>
            </div>

            {/* Ticket Info Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '1.1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.2rem',
              fontSize: '0.86rem'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Date
                </div>
                <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                  {booking.showDate}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Time
                </div>
                <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                  {booking.showTime ? booking.showTime.slice(0, 5) : ''}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Screen
                </div>
                <div style={{ fontWeight: 700, color: 'var(--accent-gold)', marginTop: '2px' }}>
                  {booking.screenName}
                </div>
              </div>
            </div>

            {/* Seats Allocated */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Reserved Seats ({booking.bookedSeats?.length || 0})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '4px' }}>
                  {booking.bookedSeats?.map((s) => (
                    <span
                      key={s.seatId}
                      style={{
                        padding: '3px 9px',
                        backgroundColor: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        color: 'var(--accent-gold)',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 800
                      }}
                    >
                      {s.seatNumber} ({s.seatType})
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Total Paid
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  ₹{Number(booking.totalAmount).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Perforated Stub / Barcode Side */}
          <div className="ticket-perforation" style={{ textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                Ticket Voucher
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', fontFamily: 'monospace', marginTop: '2px' }}>
                #{booking.bookingId}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {booking.customerName}
              </div>
            </div>

            {/* Simulated Barcode */}
            <div>
              <div className="barcode-strip" />
              <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                {paymentRef.slice(0, 16)}
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--accent-green)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={14} />
              <span>Verified in MySQL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="no-print" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem',
        marginTop: '2.5rem',
        marginBottom: '4rem'
      }}>
        <button onClick={handlePrint} className="btn btn-secondary">
          <Printer size={16} />
          <span>Print Ticket</span>
        </button>

        <Link to="/my-bookings" className="btn btn-primary">
          <Ticket size={16} />
          <span>View My Bookings</span>
        </Link>

        <Link to="/movies" className="btn btn-ghost">
          <span>Book Another Movie</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};
