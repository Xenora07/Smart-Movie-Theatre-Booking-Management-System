import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { movieService } from '../services/movieService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { MoviePoster } from '../components/MoviePoster';
import {
  Film,
  Building2,
  Monitor,
  Armchair,
  Clock,
  Ticket,
  CreditCard,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Database,
  DollarSign,
  CheckCircle2,
  X,
  MapPin,
  Calendar,
  AlertCircle,
  Store
} from 'lucide-react';
import { AdminCounterBooking } from '../components/AdminCounterBooking';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Data states
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [seats, setSeats] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);

  // Modal / Form state
  const [modalType, setModalType] = useState(null); // 'movie', 'theatre', 'screen', 'seat', 'show'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [
        moviesData,
        theatresData,
        screensData,
        seatsData,
        showsData,
        bookingsData,
        paymentsData
      ] = await Promise.all([
        movieService.getAllMovies(),
        adminService.getAllTheatres(),
        adminService.getAllScreens(),
        adminService.getAllSeats(),
        adminService.getAllShows(),
        adminService.getAllBookings(),
        adminService.getAllPayments()
      ]);

      setMovies(moviesData || []);
      setTheatres(theatresData || []);
      setScreens(screensData || []);
      setSeats(seatsData || []);
      setShows(showsData || []);
      setBookings(bookingsData || []);
      setPayments(paymentsData || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load administrative data.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Open Form
  const openForm = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData({ ...item });
    } else {
      // Defaults
      if (type === 'movie') {
        setFormData({
          title: '',
          genre: 'Sci-Fi / Action',
          durationMinutes: 120,
          language: 'English',
          rating: 8.5,
          posterUrl: '',
          description: ''
        });
      } else if (type === 'theatre') {
        setFormData({ theatreName: '', location: '' });
      } else if (type === 'screen') {
        setFormData({ theatreId: theatres[0]?.theatreId || '', screenName: '' });
      } else if (type === 'seat') {
        setFormData({ screenId: screens[0]?.screenId || '', seatNumber: '', seatType: 'REGULAR' });
      } else if (type === 'show') {
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          movieId: movies[0]?.movieId || '',
          screenId: screens[0]?.screenId || '',
          showDate: today,
          showTime: '18:00:00',
          price: 250.00
        });
      }
    }
  };

  const closeForm = () => {
    setModalType(null);
    setEditingItem(null);
    setFormData({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      if (modalType === 'movie') {
        const payload = {
          title: formData.title,
          genre: formData.genre,
          durationMinutes: Number(formData.durationMinutes),
          language: formData.language,
          rating: Number(formData.rating),
          posterUrl: formData.posterUrl,
          description: formData.description
        };
        if (editingItem) {
          await adminService.updateMovie(editingItem.movieId, payload);
          showNotification('Movie updated successfully.');
        } else {
          await adminService.createMovie(payload);
          showNotification('Movie added successfully.');
        }
      } else if (modalType === 'theatre') {
        const payload = {
          theatreName: formData.theatreName,
          location: formData.location
        };
        if (editingItem) {
          await adminService.updateTheatre(editingItem.theatreId, payload);
          showNotification('Theatre updated successfully.');
        } else {
          await adminService.createTheatre(payload);
          showNotification('Theatre created successfully.');
        }
      } else if (modalType === 'screen') {
        const payload = {
          theatreId: Number(formData.theatreId),
          screenName: formData.screenName
        };
        if (editingItem) {
          await adminService.updateScreen(editingItem.screenId, payload);
          showNotification('Screen updated successfully.');
        } else {
          await adminService.createScreen(payload);
          showNotification('Screen created successfully.');
        }
      } else if (modalType === 'seat') {
        const payload = {
          screenId: Number(formData.screenId),
          seatNumber: formData.seatNumber.toUpperCase().trim(),
          seatType: formData.seatType
        };
        if (editingItem) {
          await adminService.updateSeat(editingItem.seatId, payload);
          showNotification('Seat updated successfully.');
        } else {
          await adminService.createSeat(payload);
          showNotification('Seat created successfully.');
        }
      } else if (modalType === 'show') {
        let timeStr = formData.showTime;
        if (timeStr.length === 5) timeStr += ':00';
        const payload = {
          movieId: Number(formData.movieId),
          screenId: Number(formData.screenId),
          showDate: formData.showDate,
          showTime: timeStr,
          price: Number(formData.price)
        };
        if (editingItem) {
          await adminService.updateShow(editingItem.showId, payload);
          showNotification('Show updated successfully.');
        } else {
          await adminService.createShow(payload);
          showNotification('Show scheduled successfully.');
        }
      }

      closeForm();
      await loadAllData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Please verify input data.');
    }
  };

  const handleDelete = async (type, id, label) => {
    if (!window.confirm(`Are you sure you want to delete ${type} "${label}"? This may affect linked shows or seats.`)) {
      return;
    }
    try {
      setError(null);
      if (type === 'Movie') await adminService.deleteMovie(id);
      if (type === 'Theatre') await adminService.deleteTheatre(id);
      if (type === 'Screen') await adminService.deleteScreen(id);
      if (type === 'Seat') await adminService.deleteSeat(id);
      if (type === 'Show') await adminService.deleteShow(id);

      showNotification(`${type} deleted successfully.`);
      await loadAllData();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to delete ${type}. Check foreign key constraints.`);
    }
  };

  if (loading && movies.length === 0) {
    return <LoadingSpinner text="Connecting to cinema operations backend..." />;
  }

  // Calculate statistics
  const totalRevenue = payments
    .filter((p) => p.paymentStatus === 'SUCCESS')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const confirmedBookingsCount = bookings.filter((b) => b.status === 'CONFIRMED').length;

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Admin Header */}
      <div className="admin-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-gold)', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
            <Database size={15} />
            <span>Database Management Console</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Cinema Operations &amp; Audits
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Direct administrative oversight of the 9 core MySQL tables &amp; financial audit trail
          </p>
        </div>

        <button
          onClick={loadAllData}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={15} />
          <span>Sync Database</span>
        </button>
      </div>

      {actionSuccess && (
        <div style={{
          padding: '0.9rem 1.4rem',
          backgroundColor: 'var(--color-success-bg)',
          border: '1px solid var(--color-success-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-success-text)',
          marginBottom: '1.5rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      <ErrorMessage message={error} />

      {/* Admin Navigation Tabs */}
      <div className="admin-nav-tabs">
        {[
          { id: 'overview', label: 'Overview & Stats', icon: Database },
          { id: 'counter', label: 'Counter Booking', icon: Store },
          { id: 'movies', label: `Movies (${movies.length})`, icon: Film },
          { id: 'theatres', label: `Theatres (${theatres.length})`, icon: Building2 },
          { id: 'screens', label: `Screens (${screens.length})`, icon: Monitor },
          { id: 'seats', label: `Seats (${seats.length})`, icon: Armchair },
          { id: 'shows', label: `Shows (${shows.length})`, icon: Clock },
          { id: 'bookings', label: `Bookings (${bookings.length})`, icon: Ticket },
          { id: 'payments', label: `Payments (${payments.length})`, icon: CreditCard }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`admin-tab-btn ${isActive ? 'active' : ''}`}
            >
              <IconComp size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          <div className="admin-stats-grid">
            <div className="stat-card">
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Platform Revenue
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '0.4rem' }}>
                  ₹{totalRevenue.toFixed(2)}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                  From verified successful payments
                </div>
              </div>
              <div className="stat-icon">
                <DollarSign size={22} />
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Confirmed Bookings
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-success-text)', marginTop: '0.4rem' }}>
                  {confirmedBookingsCount}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                  Active reserved reservations
                </div>
              </div>
              <div className="stat-icon" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)' }}>
                <Ticket size={22} />
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Active Scheduled Shows
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
                  {shows.length}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                  Across {screens.length} auditoriums
                </div>
              </div>
              <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa' }}>
                <Clock size={22} />
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Physical Seats Inventory
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
                  {seats.length}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                  In {theatres.length} cinema theatres
                </div>
              </div>
              <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#a78bfa' }}>
                <Armchair size={22} />
              </div>
            </div>
          </div>

          {/* DBMS Architecture Reference Snapshot */}
          <div className="card-box" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)'
              }}>
                <Database size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Academic DBMS 9-Table Relational Schema
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  Strict referential integrity, BCNF/3NF normalization &amp; transactional isolation
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              fontSize: '0.86rem'
            }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--accent-gold)' }}>1. CUSTOMER:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Authentication, BCrypt password hashes, and CUSTOMER / ADMIN role enforcement.
                </p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--accent-gold)' }}>2. MOVIE:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Film metadata (title, duration in minutes, language, genre, rating, and poster URL).
                </p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--accent-gold)' }}>3. THEATRE &amp; 4. SCREEN:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Physical cinema complexes and individual auditoriums with screen formats.
                </p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--accent-gold)' }}>5. SEAT:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Physical seats with row labels, numbers, and tiers (REGULAR 1.0x, PREMIUM 1.2x, RECLINER 1.5x).
                </p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--accent-gold)' }}>6. SHOW:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Schedule instances linking Movie, Screen, Date, Start Time, and Base Price.
                </p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--accent-gold)' }}>7. BOOKING &amp; 8. BOOKING_SEAT:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Master booking records and junction allocations with UNIQUE(show_id, seat_id) constraint.
                </p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--accent-gold)' }}>9. PAYMENT:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  1-to-1 simulated payment audit records with method, status, and transaction references.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: COUNTER BOOKING */}
      {activeTab === 'counter' && (
        <AdminCounterBooking
          shows={shows}
          movies={movies}
          onBookingSuccess={loadAllData}
        />
      )}

      {/* TAB 2: MOVIES */}
      {activeTab === 'movies' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>Movie Catalogue</h2>
            <button onClick={() => openForm('movie')} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Add New Movie</span>
            </button>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Poster</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Duration</th>
                  <th>Lang</th>
                  <th>Rating</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m.movieId}>
                    <td>
                      <div style={{ width: '40px', height: '56px', borderRadius: '4px', overflow: 'hidden' }}>
                        <MoviePoster src={m.posterUrl} alt={m.title} title={m.title} />
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.title}</td>
                    <td>{m.genre || '—'}</td>
                    <td>{m.durationMinutes ? `${m.durationMinutes}m` : '—'}</td>
                    <td>{m.language || '—'}</td>
                    <td>
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
                        ⭐ {m.rating ? Number(m.rating).toFixed(1) : '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => openForm('movie', m)}
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: '0.4rem', padding: '5px 10px' }}
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete('Movie', m.movieId, m.title)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '5px 10px' }}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: THEATRES */}
      {activeTab === 'theatres' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>Theatre Venues</h2>
            <button onClick={() => openForm('theatre')} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Add Theatre</span>
            </button>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Theatre Name</th>
                  <th>Location</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {theatres.map((t) => (
                  <tr key={t.theatreId}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{t.theatreId}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.theatreName}</td>
                    <td>{t.location || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => openForm('theatre', t)}
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: '0.4rem', padding: '5px 10px' }}
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete('Theatre', t.theatreId, t.theatreName)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '5px 10px' }}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SCREENS */}
      {activeTab === 'screens' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>Screens &amp; Auditoriums</h2>
            <button onClick={() => openForm('screen')} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Add Screen</span>
            </button>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Screen Name</th>
                  <th>Theatre Venue</th>
                  <th>Capacity</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {screens.map((s) => (
                  <tr key={s.screenId}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{s.screenId}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.screenName}</td>
                    <td>{s.theatreName || `Theatre #${s.theatreId}`}</td>
                    <td>{s.totalSeats || '—'} seats</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => openForm('screen', s)}
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: '0.4rem', padding: '5px 10px' }}
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete('Screen', s.screenId, s.screenName)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '5px 10px' }}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SEATS */}
      {activeTab === 'seats' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>Auditorium Seat Layout</h2>
            <button onClick={() => openForm('seat')} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Add Seat</span>
            </button>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Seat ID</th>
                  <th>Screen</th>
                  <th>Seat Number</th>
                  <th>Seat Tier</th>
                  <th>Price Multiplier</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {seats.map((seat) => (
                  <tr key={seat.seatId}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{seat.seatId}</td>
                    <td>{screens.find((s) => s.screenId === seat.screenId)?.screenName || `Screen #${seat.screenId}`}</td>
                    <td style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>{seat.seatNumber}</td>
                    <td>
                      <span className={`badge ${seat.seatType === 'RECLINER' ? 'badge-cancelled' : seat.seatType === 'PREMIUM' ? 'badge-confirmed' : ''}`}
                            style={{ backgroundColor: seat.seatType === 'REGULAR' ? '#1e2638' : undefined }}>
                        {seat.seatType}
                      </span>
                    </td>
                    <td>
                      {seat.seatType === 'RECLINER' ? '1.5x Base' : seat.seatType === 'PREMIUM' ? '1.2x Base' : '1.0x Base'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => openForm('seat', seat)}
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: '0.4rem', padding: '5px 10px' }}
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete('Seat', seat.seatId, seat.seatNumber)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '5px 10px' }}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: SHOWS */}
      {activeTab === 'shows' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>Show Scheduling</h2>
            <button onClick={() => openForm('show')} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Schedule Show</span>
            </button>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Show ID</th>
                  <th>Movie</th>
                  <th>Screen &amp; Theatre</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Base Rate</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((show) => (
                  <tr key={show.showId}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{show.showId}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{show.movieTitle || `Movie #${show.movieId}`}</td>
                    <td>{show.screenName} ({show.theatreName})</td>
                    <td>{show.showDate}</td>
                    <td>{show.showTime ? show.showTime.slice(0, 5) : '—'}</td>
                    <td style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>₹{Number(show.price).toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => openForm('show', show)}
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: '0.4rem', padding: '5px 10px' }}
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete('Show', show.showId, `Show #${show.showId}`)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '5px 10px' }}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: BOOKINGS AUDIT */}
      {activeTab === 'bookings' && (
        <div>
          <div style={{ marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Customer Bookings Audit Trail
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Real-time audit log of all reservations, seat locks, and customer references
            </p>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Movie &amp; Venue</th>
                  <th>Schedule</th>
                  <th>Allocated Seats</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.bookingId}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--accent-gold)' }}>
                      #{b.bookingId}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.customerName || '—'}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{b.customerEmail || '—'}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.movieTitle || '—'}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{b.theatreName} — {b.screenName}</div>
                    </td>
                    <td>
                      <div>{b.showDate || '—'}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{b.showTime ? b.showTime.slice(0, 5) : '—'}</div>
                    </td>
                    <td>
                      {b.bookedSeats && b.bookedSeats.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                          {b.bookedSeats.map((s) => (
                            <span key={s.seatId} style={{ padding: '1px 6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', fontSize: '0.78rem' }}>
                              {s.seatNumber}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-faint)' }}>—</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>
                      ₹{Number(b.totalAmount).toFixed(2)}
                    </td>
                    <td>
                      <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-confirmed' : b.status === 'CANCELLED' ? 'badge-cancelled' : 'badge-pending'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {b.bookingDate ? new Date(b.bookingDate).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: PAYMENTS AUDIT */}
      {activeTab === 'payments' && (
        <div>
          <div style={{ marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Payment Records Audit Trail
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Financial transactions log with status, payment method, and authoritative amount
            </p>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Booking Ref</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Transaction Ref</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.paymentId}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{p.paymentId}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-gold)' }}>
                      #{p.bookingId || '—'}
                    </td>
                    <td>
                      <span className="badge" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        {p.method || '—'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800 }}>₹{Number(p.amount).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.paymentStatus === 'SUCCESS' ? 'badge-confirmed' : p.paymentStatus === 'REFUNDED' ? 'badge-refunded' : 'badge-cancelled'}`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {p.transactionRef || `SIM-TXN-${p.paymentId * 8831}`}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL / FORM OVERLAY */}
      {modalType && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.8rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {editingItem ? `Edit ${modalType.toUpperCase()}` : `Add New ${modalType.toUpperCase()}`}
              </h3>
              <button
                type="button"
                onClick={closeForm}
                style={{ color: 'var(--text-muted)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              {/* MOVIE FORM */}
              {modalType === 'movie' && (
                <>
                  <div className="form-group">
                    <label>Movie Title *</label>
                    <input name="title" value={formData.title || ''} onChange={handleFormChange} required />
                  </div>
                  <div className="form-group">
                    <label>Genre *</label>
                    <input name="genre" value={formData.genre || ''} onChange={handleFormChange} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Duration (mins) *</label>
                      <input type="number" name="durationMinutes" value={formData.durationMinutes || ''} onChange={handleFormChange} required min="1" />
                    </div>
                    <div className="form-group">
                      <label>Language *</label>
                      <input name="language" value={formData.language || ''} onChange={handleFormChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Rating (0.0 - 10.0)</label>
                    <input type="number" step="0.1" name="rating" value={formData.rating || ''} onChange={handleFormChange} min="0" max="10" />
                  </div>
                  <div className="form-group">
                    <label>Poster Image URL</label>
                    <input name="posterUrl" value={formData.posterUrl || ''} onChange={handleFormChange} placeholder="https://images.unsplash.com/..." />
                  </div>
                  <div className="form-group">
                    <label>Synopsis / Description</label>
                    <textarea name="description" rows="3" value={formData.description || ''} onChange={handleFormChange} />
                  </div>
                </>
              )}

              {/* THEATRE FORM */}
              {modalType === 'theatre' && (
                <>
                  <div className="form-group">
                    <label>Theatre Name *</label>
                    <input name="theatreName" value={formData.theatreName || ''} onChange={handleFormChange} required />
                  </div>
                  <div className="form-group">
                    <label>Location / City *</label>
                    <input name="location" value={formData.location || ''} onChange={handleFormChange} required />
                  </div>
                </>
              )}

              {/* SCREEN FORM */}
              {modalType === 'screen' && (
                <>
                  <div className="form-group">
                    <label>Theatre Venue *</label>
                    <select name="theatreId" value={formData.theatreId || ''} onChange={handleFormChange} required>
                      {theatres.map((t) => (
                        <option key={t.theatreId} value={t.theatreId}>
                          {t.theatreName} ({t.location})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Screen Name *</label>
                    <input name="screenName" value={formData.screenName || ''} onChange={handleFormChange} placeholder="e.g. Screen 1 - Dolby Atmos" required />
                  </div>
                </>
              )}

              {/* SEAT FORM */}
              {modalType === 'seat' && (
                <>
                  <div className="form-group">
                    <label>Screen *</label>
                    <select name="screenId" value={formData.screenId || ''} onChange={handleFormChange} required>
                      {screens.map((s) => (
                        <option key={s.screenId} value={s.screenId}>
                          {s.screenName} ({s.theatreName})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Seat Number * (e.g. A1, B4, C10)</label>
                    <input name="seatNumber" value={formData.seatNumber || ''} onChange={handleFormChange} required maxLength={12} />
                  </div>
                  <div className="form-group">
                    <label>Seat Tier / Type *</label>
                    <select name="seatType" value={formData.seatType || 'REGULAR'} onChange={handleFormChange} required>
                      <option value="REGULAR">REGULAR (1.0x Base Price)</option>
                      <option value="PREMIUM">PREMIUM (1.2x Base Price)</option>
                      <option value="RECLINER">RECLINER (1.5x Base Price)</option>
                    </select>
                  </div>
                </>
              )}

              {/* SHOW FORM */}
              {modalType === 'show' && (
                <>
                  <div className="form-group">
                    <label>Movie *</label>
                    <select name="movieId" value={formData.movieId || ''} onChange={handleFormChange} required>
                      {movies.map((m) => (
                        <option key={m.movieId} value={m.movieId}>
                          {m.title} ({m.language})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Screen &amp; Auditorium *</label>
                    <select name="screenId" value={formData.screenId || ''} onChange={handleFormChange} required>
                      {screens.map((s) => (
                        <option key={s.screenId} value={s.screenId}>
                          {s.screenName} ({s.theatreName})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Date *</label>
                      <input type="date" name="showDate" value={formData.showDate || ''} onChange={handleFormChange} required />
                    </div>
                    <div className="form-group">
                      <label>Time *</label>
                      <input type="time" step="1" name="showTime" value={formData.showTime || '18:00:00'} onChange={handleFormChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Base Price (₹) *</label>
                    <input type="number" step="0.5" name="price" value={formData.price || ''} onChange={handleFormChange} required min="1" />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.8rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={closeForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
