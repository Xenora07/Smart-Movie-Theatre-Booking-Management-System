import api from './api';

export const bookingService = {
  async createBooking(showId, seatIds) {
    if (!showId || isNaN(Number(showId))) {
      throw new Error(`Valid numeric Show ID is required, received: ${showId}`);
    }
    if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      throw new Error('At least one seat must be selected to create a booking.');
    }
    const response = await api.post('/bookings', { showId, seatIds });
    return response.data;
  },

  async getMyBookings() {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  async getBookingById(bookingId) {
    if (!bookingId || isNaN(Number(bookingId))) {
      throw new Error(`Valid numeric Booking ID is required, received: ${bookingId}`);
    }
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  async simulatePayment(bookingId, method) {
    if (!bookingId || isNaN(Number(bookingId))) {
      throw new Error(`Valid numeric Booking ID is required, received: ${bookingId}`);
    }
    const response = await api.post(`/bookings/${bookingId}/payment`, { method });
    return response.data;
  },

  async cancelBooking(bookingId) {
    if (!bookingId || isNaN(Number(bookingId))) {
      throw new Error(`Valid numeric Booking ID is required, received: ${bookingId}`);
    }
    const response = await api.post(`/bookings/${bookingId}/cancel`);
    return response.data;
  }
};
