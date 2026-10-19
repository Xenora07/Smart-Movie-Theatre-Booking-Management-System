import api from './api';

export const adminService = {
  // Movies
  async createMovie(data) {
    const response = await api.post('/admin/movies', data);
    return response.data;
  },
  async updateMovie(id, data) {
    const response = await api.put(`/admin/movies/${id}`, data);
    return response.data;
  },
  async deleteMovie(id) {
    const response = await api.delete(`/admin/movies/${id}`);
    return response.data;
  },

  // Theatres
  async getAllTheatres() {
    const response = await api.get('/admin/theatres');
    return response.data;
  },
  async createTheatre(data) {
    const response = await api.post('/admin/theatres', data);
    return response.data;
  },
  async updateTheatre(id, data) {
    const response = await api.put(`/admin/theatres/${id}`, data);
    return response.data;
  },
  async deleteTheatre(id) {
    const response = await api.delete(`/admin/theatres/${id}`);
    return response.data;
  },

  // Screens
  async getAllScreens() {
    const response = await api.get('/admin/screens');
    return response.data;
  },
  async createScreen(data) {
    const response = await api.post('/admin/screens', data);
    return response.data;
  },
  async updateScreen(id, data) {
    const response = await api.put(`/admin/screens/${id}`, data);
    return response.data;
  },
  async deleteScreen(id) {
    const response = await api.delete(`/admin/screens/${id}`);
    return response.data;
  },

  // Seats
  async getAllSeats() {
    const response = await api.get('/admin/seats');
    return response.data;
  },
  async createSeat(data) {
    const response = await api.post('/admin/seats', data);
    return response.data;
  },
  async updateSeat(id, data) {
    const response = await api.put(`/admin/seats/${id}`, data);
    return response.data;
  },
  async deleteSeat(id) {
    const response = await api.delete(`/admin/seats/${id}`);
    return response.data;
  },

  // Shows
  async getAllShows() {
    const response = await api.get('/admin/shows');
    return response.data;
  },
  async createShow(data) {
    const response = await api.post('/admin/shows', data);
    return response.data;
  },
  async updateShow(id, data) {
    const response = await api.put(`/admin/shows/${id}`, data);
    return response.data;
  },
  async deleteShow(id) {
    const response = await api.delete(`/admin/shows/${id}`);
    return response.data;
  },

  // Reports
  async getAllBookings() {
    const response = await api.get('/admin/bookings');
    return response.data;
  },
  async getAllPayments() {
    const response = await api.get('/admin/payments');
    return response.data;
  },

  // Counter Booking
  async searchCustomers(query) {
    const response = await api.get('/admin/customers/search', { params: { query } });
    return response.data;
  },
  async createCounterBooking(data) {
    const response = await api.post('/admin/counter-bookings', data);
    return response.data;
  }
};
