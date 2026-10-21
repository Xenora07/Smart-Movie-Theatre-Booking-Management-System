import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { movieService } from '../services/movieService';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import {
  Film,
  Building2,
  Monitor,
  Armchair,
  Clock,
  Ticket,
  CreditCard,
  Search,
  UserCheck,
  UserPlus,
  Banknote,
  QrCode,
  Printer,
  CheckCircle2,
  Calendar,
  X,
  Sparkles
} from 'lucide-react';

export const AdminCounterBooking = ({ shows, movies, onBookingSuccess }) => {
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [selectedShowId, setSelectedShowId] = useState('');
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [error, setError] = useState(null);

  // Customer selection mode: 'search' or 'manual'
  const [customerMode, setCustomerMode] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Manual walk-in fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('CASH_SIMULATED');
  const [submitting, setSubmitting] = useState(false);

  // Printable ticket modal
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Filter shows by selected movie
  const availableShows = shows.filter(
    (s) => !selectedMovieId || String(s.movieId) === String(selectedMovieId)
  );

  // Load seats when show selection changes
  useEffect(() => {
    if (!selectedShowId) {
      setSeats([]);
      setSelectedSeatIds([]);
      return;
    }

    const fetchSeats = async () => {
      try {
        setLoadingSeats(true);
        setError(null);
        setSelectedSeatIds([]);
        const seatData = await movieService.getSeatsForShow(selectedShowId);
        setSeats(seatData || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve show seat inventory.');
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchSeats();
  }, [selectedShowId]);

  // Customer search with debounce
  useEffect(() => {
    if (customerMode !== 'search' || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        const results = await adminService.searchCustomers(searchQuery.trim());
        setSearchResults(results || []);
      } catch (err) {
        console.error('Customer search error:', err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, customerMode]);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setSearchQuery('');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
  };

  const toggleSeat = (seatId) => {
    setSelectedSeatIds((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  // Calculate pricing
  const currentShow = shows.find((s) => String(s.showId) === String(selectedShowId));
  const basePrice = currentShow ? Number(currentShow.price) : 0;

  const calculateSeatPrice = (seatType) => {
    if (seatType === 'PREMIUM') return basePrice * 1.2;
    if (seatType === 'RECLINER') return basePrice * 1.5;
    return basePrice;
  };

  const totalPrice = selectedSeatIds.reduce((sum, id) => {
    const s = seats.find((seat) => seat.seatId === id);
    return sum + (s ? calculateSeatPrice(s.seatType) : 0);
  }, 0);

  const handleSubmitCounterBooking = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedShowId) {
      setError('Please select a scheduled show.');
      return;
    }
    if (selectedSeatIds.length === 0) {
      setError('Please select at least one available seat.');
      return;
    }

    if (customerMode === 'search' && !selectedCustomer) {
      setError('Please search and select an existing customer, or switch to Walk-in Guest.');
      return;
    }

    if (customerMode === 'manual') {
      if (!customerName.trim()) {
        setError('Customer name is required for walk-in booking.');
        return;
      }
      if (!customerPhone.trim()) {
        setError('Customer phone number is required for walk-in booking.');
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload = {
        showId: Number(selectedShowId),
        seatIds: selectedSeatIds,
        paymentMethod: paymentMethod
      };

      if (selectedCustomer) {
        payload.existingCustomerId = selectedCustomer.customerId;
      } else {
        payload.customerName = customerName.trim();
        payload.customerPhone = customerPhone.trim();
        if (customerEmail.trim()) {
          payload.customerEmail = customerEmail.trim();
        }
      }

      const bookingResult = await adminService.createCounterBooking(payload);
      setConfirmedBooking(bookingResult);

      // Reset selection state
      setSelectedSeatIds([]);
      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Counter booking failed. Please verify seat availability.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setConfirmedBooking(null);
    setSelectedShowId('');
    setSelectedSeatIds([]);
    handleClearCustomer();
    setError(null);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* Header Banner */}
      <div className="card-box" style={{
        padding: '1.8rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.12) 0%, rgba(245, 158, 11, 0.05) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--accent-gold)',
            color: 'var(--accent-contrast)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Banknote size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Box Office Counter Booking Portal
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Issue cinema tickets on behalf of existing patrons or walk-in guests with immediate POS / Cash payment simulation
            </p>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmitCounterBooking}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* STEP 1: SELECT MOVIE & SHOW */}
          <div className="card-box" style={{ padding: '1.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
              <Film size={18} />
              <span>Step 1: Select Movie &amp; Screening</span>
            </div>

            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label className="form-label">Filter by Movie</label>
              <select
                className="form-control"
                value={selectedMovieId}
                onChange={(e) => {
                  setSelectedMovieId(e.target.value);
                  setSelectedShowId('');
                }}
              >
                <option value="">-- All Active Movies ({movies.length}) --</option>
                {movies.map((m) => (
                  <option key={m.movieId} value={m.movieId}>
                    {m.title} ({m.language} • {m.genre})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Scheduled Show *</label>
              <select
                className="form-control"
                value={selectedShowId}
                onChange={(e) => setSelectedShowId(e.target.value)}
                required
              >
                <option value="">-- Choose Showtime &amp; Screen --</option>
                {availableShows.map((s) => (
                  <option key={s.showId} value={s.showId}>
                    {s.movieTitle} | {s.theatreName} ({s.screenName}) | {s.showDate} @ {s.showTime?.slice(0, 5)} — ₹{Number(s.price).toFixed(0)} Base
                  </option>
                ))}
              </select>
            </div>

            {currentShow && (
              <div style={{
                marginTop: '1.2rem',
                padding: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                  {currentShow.movieTitle}
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  {currentShow.theatreName} • {currentShow.screenName} ({currentShow.theatreLocation || 'Main Complex'})
                </div>
                <div style={{ color: 'var(--accent-gold)', fontWeight: 700, marginTop: '0.4rem' }}>
                  Date: {currentShow.showDate} • Time: {currentShow.showTime?.slice(0, 5)} • Base: ₹{Number(currentShow.price).toFixed(2)}
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: CUSTOMER ASSIGNMENT */}
          <div className="card-box" style={{ padding: '1.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <UserCheck size={18} />
                <span>Step 2: Customer Identity</span>
              </div>

              {/* Mode switch pills */}
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerMode('search');
                    handleClearCustomer();
                  }}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: customerMode === 'search' ? 'var(--accent-gold)' : 'var(--border-subtle)',
                    backgroundColor: customerMode === 'search' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                    color: customerMode === 'search' ? 'var(--accent-gold)' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  Existing Patron
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerMode('manual');
                    handleClearCustomer();
                  }}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: customerMode === 'manual' ? 'var(--accent-gold)' : 'var(--border-subtle)',
                    backgroundColor: customerMode === 'manual' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                    color: customerMode === 'manual' ? 'var(--accent-gold)' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  Walk-in Guest
                </button>
              </div>
            </div>

            {/* Mode A: Search Existing Customer */}
            {customerMode === 'search' && (
              <div>
                {selectedCustomer ? (
                  <div style={{
                    padding: '1.2rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>
                          {selectedCustomer.name}
                        </span>
                        <span style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          color: '#34d399',
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 700
                        }}>
                          Patron #{selectedCustomer.customerId}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                        Phone: {selectedCustomer.phone || 'N/A'} • Email: {selectedCustomer.email || 'N/A'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearCustomer}
                      className="btn btn-ghost btn-sm"
                      title="Clear Selected Customer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="form-group" style={{ position: 'relative' }}>
                      <label className="form-label">Search Patron by Phone, Email, or Name</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Type at least 2 characters to search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{ paddingLeft: '2.5rem' }}
                        />
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      </div>
                    </div>

                    {searching && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Searching customer directory...</div>}

                    {searchResults.length > 0 && (
                      <div style={{
                        marginTop: '0.6rem',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        maxHeight: '180px',
                        overflowY: 'auto'
                      }}>
                        {searchResults.map((c) => (
                          <div
                            key={c.customerId}
                            onClick={() => handleSelectCustomer(c)}
                            style={{
                              padding: '0.7rem 1rem',
                              borderBottom: '1px solid var(--border-subtle)',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                            className="search-result-item"
                          >
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                {c.phone} • {c.email}
                              </div>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700 }}>Select</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {searchQuery.trim().length >= 2 && !searching && searchResults.length === 0 && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        No existing patron found. Switch to "Walk-in Guest" to register on the fly.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Mode B: Manual Walk-in Customer Entry */}
            {customerMode === 'manual' && (
              <div>
                <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                  <label className="form-label">Guest Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ramesh Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required={customerMode === 'manual'}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="e.g. 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required={customerMode === 'manual'}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address (Optional for E-Ticket)</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="e.g. ramesh@example.com (optional)"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  ✓ Safe walk-in record without password creation or credentials fabrication.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STEP 3: INTERACTIVE SEAT SELECTION */}
        {selectedShowId && (
          <div className="card-box" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  Step 3: Seat Layout &amp; Availability
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Click to Allocate Counter Seats
                </h3>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: 'var(--accent-gold)', boxShadow: 'var(--shadow-glow)' }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Selected ({selectedSeatIds.length})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', opacity: 0.4 }} />
                  <span style={{ color: 'var(--text-muted)' }}>Occupied</span>
                </div>
              </div>
            </div>

            {loadingSeats ? (
              <LoadingSpinner text="Retrieving live screen seat matrix..." />
            ) : seats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No seat inventory configured for this screen.
              </div>
            ) : (
              <div>
                {/* Cinema Screen Visual Bar */}
                <div style={{
                  width: '80%',
                  height: '8px',
                  margin: '0 auto 2.5rem',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, transparent 0%, var(--accent-gold) 50%, transparent 100%)',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.6)',
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontWeight: 700
                  }}>
                    Screen / Stage Direction
                  </span>
                </div>

                {/* Seat Matrix Grid */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.6rem',
                  justifyContent: 'center',
                  maxWidth: '750px',
                  margin: '0 auto 2rem'
                }}>
                  {seats.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.seatId);
                    const isAvailable = seat.available;
                    const price = calculateSeatPrice(seat.seatType);

                    return (
                      <button
                        key={seat.seatId}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => toggleSeat(seat.seatId)}
                        title={`Seat ${seat.seatNumber} (${seat.seatType}) - ₹${price.toFixed(0)}`}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          transition: 'all 0.2s ease',
                          border: '1px solid',
                          backgroundColor: isSelected
                            ? 'var(--accent-gold)'
                            : isAvailable
                            ? 'var(--bg-secondary)'
                            : 'rgba(255, 255, 255, 0.05)',
                          color: isSelected
                            ? 'var(--accent-contrast)'
                            : isAvailable
                            ? 'var(--text-primary)'
                            : 'var(--text-faint)',
                          borderColor: isSelected
                            ? 'var(--accent-gold)'
                            : isAvailable
                            ? 'var(--border-light)'
                            : 'transparent',
                          boxShadow: isSelected ? '0 0 12px rgba(245, 158, 11, 0.5)' : 'none',
                          opacity: isAvailable ? 1 : 0.35
                        }}
                      >
                        <span>{seat.seatNumber}</span>
                        <span style={{ fontSize: '0.62rem', opacity: isSelected ? 0.9 : 0.6 }}>
                          ₹{price.toFixed(0)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: PAYMENT SIMULATION & ISSUANCE */}
        {selectedSeatIds.length > 0 && (
          <div className="card-box" style={{
            padding: '2rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-accent)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <div style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  Step 4: POS Payment &amp; Issue Ticket
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  Authoritative Total: ₹{totalPrice.toFixed(2)}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                  {selectedSeatIds.length} seat(s) selected: {selectedSeatIds.map((id) => seats.find((s) => s.seatId === id)?.seatNumber).join(', ')}
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'CASH_SIMULATED', label: 'Cash at Counter', icon: Banknote },
                  { id: 'UPI', label: 'Counter UPI QR', icon: QrCode },
                  { id: 'CARD_SIMULATED', label: 'Counter POS Card', icon: CreditCard }
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isChosen = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.7rem 1.1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid',
                        borderColor: isChosen ? 'var(--accent-gold)' : 'var(--border-light)',
                        backgroundColor: isChosen ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                        color: isChosen ? 'var(--accent-contrast)' : 'var(--text-primary)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Icon size={16} />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-lg"
                style={{ minWidth: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
              >
                <Ticket size={20} />
                <span>{submitting ? 'Processing Transaction...' : 'Sell & Print Ticket'}</span>
              </button>
            </div>
          </div>
        )}
      </form>

      {/* CONFIRMED TICKET PRINT MODAL */}
      {confirmedBooking && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="card-box" style={{
            maxWidth: '650px',
            width: '100%',
            padding: '2.5rem',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '2px solid var(--accent-gold)'
          }}>
            <button
              onClick={() => setConfirmedBooking(null)}
              style={{
                position: 'absolute',
                top: '1.2rem',
                right: '1.2rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={22} />
            </button>

            {/* Printable Ticket Area */}
            <div id="counter-printable-ticket" style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={16} />
                <span>Box Office Counter Sale Confirmed</span>
              </div>

              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Cinema Boarding Pass
              </h2>
              <div style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.8rem' }}>
                Receipt #{confirmedBooking.bookingId} • Status: {confirmedBooking.status}
              </div>

              {/* Receipt Details Grid */}
              <div style={{
                textAlign: 'left',
                backgroundColor: 'var(--bg-secondary)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                marginBottom: '1.8rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Movie Title</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{confirmedBooking.movieTitle}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Customer Name</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{confirmedBooking.customerName}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Theatre &amp; Screen</span>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                      {confirmedBooking.theatreName} — {confirmedBooking.screenName}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Show Date &amp; Time</span>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                      {confirmedBooking.showDate} @ {confirmedBooking.showTime?.slice(0, 5)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Allocated Seats</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                      {(confirmedBooking.bookedSeats || []).map((s) => s.seatNumber).join(', ')}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payment Mode &amp; Amount</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
                      ₹{Number(confirmedBooking.totalAmount).toFixed(2)} ({confirmedBooking.payment?.method || paymentMethod})
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Printer size={18} />
                <span>Print Physical Ticket / Receipt</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Issue Another Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
