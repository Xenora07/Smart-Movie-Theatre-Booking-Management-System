import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import {
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  ShieldCheck,
  Film,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ChevronLeft,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export const CheckoutPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [method, setMethod] = useState('UPI');
  const [demoInput, setDemoInput] = useState('demo@upi');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const loadBooking = async () => {
    if (!bookingId || isNaN(Number(bookingId))) {
      setError('Invalid booking ID. Please return to your bookings or start a new reservation.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getBookingById(bookingId);
      setBooking(data);
      if (data.status === 'CONFIRMED') {
        navigate(`/confirmation/${bookingId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);
      setError(null);
      // Brief simulated delay for realistic transactional UX
      await new Promise((resolve) => setTimeout(resolve, 800));
      const updated = await bookingService.simulatePayment(bookingId, method);
      navigate(`/confirmation/${updated.bookingId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment simulation failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving booking invoice details..." />;
  }

  if (!booking) {
    return <ErrorMessage message={error || 'Booking not found.'} onRetry={loadBooking} />;
  }

  const paymentMethods = [
    {
      id: 'UPI',
      name: 'UPI / QR Simulator',
      desc: 'Instant verification via demo VPA',
      icon: Smartphone,
      defaultInput: 'alice@okhdfcbank'
    },
    {
      id: 'CARD_SIMULATED',
      name: 'Credit / Debit Card (Simulated)',
      desc: 'Visa, Mastercard, RuPay',
      icon: CreditCard,
      defaultInput: '4532 •••• •••• 8892'
    },
    {
      id: 'NET_BANKING_SIMULATED',
      name: 'Net Banking (Simulated)',
      desc: 'HDFC, ICICI, SBI, Axis',
      icon: Building2,
      defaultInput: 'HDFC Bank — Retail NetBanking'
    },
    {
      id: 'CASH_SIMULATED',
      name: 'Cash at Box Office',
      desc: 'Pay at cinema counter',
      icon: Banknote,
      defaultInput: 'Collect & pay at box office'
    }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to={`/shows/${booking.showId}/seats`} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
          <ChevronLeft size={18} />
          <span>Change Seat Selection</span>
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          color: 'var(--accent-gold)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.78rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}>
          <ShieldCheck size={14} />
          <span>Simulated Checkout Portal</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>
          Confirm &amp; Pay
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Review your reservation breakdown before generating your verified digital cinema ticket
        </p>
      </div>

      <ErrorMessage message={error} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Order Summary Card */}
        <div className="card-box" style={{ padding: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.2rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.8rem'
          }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              Booking Summary
            </h2>
            <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--accent-gold)', fontWeight: 700 }}>
              ID: #{booking.bookingId}
            </span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.3rem' }}>
              {booking.movieTitle}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={14} color="var(--accent-gold)" />
              <span>{booking.theatreName} — {booking.screenName}</span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            backgroundColor: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            fontSize: '0.86rem'
          }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
                Screen Date
              </div>
              <div style={{ fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>
                {booking.showDate}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700 }}>
                Showtime
              </div>
              <div style={{ fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>
                {booking.showTime ? booking.showTime.slice(0, 5) : ''}
              </div>
            </div>
          </div>

          {/* Seat List */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              Allocated Seats ({booking.bookedSeats?.length || 0}):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {booking.bookedSeats?.map((s) => (
                <div
                  key={s.seatId}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--accent-gold)'
                  }}
                >
                  {s.seatNumber} ({s.seatType})
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Total Box */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline'
          }}>
            <div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Payable</span>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Authoritative server-side calculation
              </div>
            </div>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              ₹{Number(booking.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Right Column: Simulated Payment Selector */}
        <div className="card-box" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.8rem' }}>
            Select Payment Method
          </h2>

          <form onSubmit={handlePay}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {paymentMethods.map((m) => {
                const isSelected = method === m.id;
                const IconComponent = m.icon;

                return (
                  <label
                    key={m.id}
                    onClick={() => {
                      setMethod(m.id);
                      setDemoInput(m.defaultInput);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.9rem',
                      padding: '0.9rem 1.1rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-secondary)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent-gold)' : 'var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      checked={isSelected}
                      onChange={() => {}}
                      style={{ accentColor: 'var(--accent-gold)' }}
                    />
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? 'var(--accent-gold)' : 'var(--text-secondary)'
                    }}>
                      <IconComponent size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: isSelected ? '#ffffff' : 'var(--text-primary)' }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {m.desc}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Simulated Input Field Preview */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Demo Payment Reference</label>
              <input
                type="text"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                placeholder="Simulated reference..."
                required
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                * Academic simulation: No real banking details or payment gateway invoked.
              </span>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', padding: '14px' }}
            >
              {processing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing Simulated Transaction...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Pay ₹{Number(booking.totalAmount).toFixed(2)} &amp; Issue Ticket</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
