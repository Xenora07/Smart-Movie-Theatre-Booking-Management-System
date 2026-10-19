import api from './api';

export const movieService = {
  async getAllMovies() {
    const response = await api.get('/movies');
    return response.data;
  },

  async getMovieById(movieId) {
    if (!movieId || isNaN(Number(movieId))) {
      throw new Error(`Valid numeric Movie ID is required, received: ${movieId}`);
    }
    const response = await api.get(`/movies/${movieId}`);
    return response.data;
  },

  async getShowsForMovie(movieId) {
    if (!movieId || isNaN(Number(movieId))) {
      throw new Error(`Valid numeric Movie ID is required, received: ${movieId}`);
    }
    const response = await api.get(`/movies/${movieId}/shows`);
    return response.data;
  },

  async getShowById(showId) {
    if (!showId || isNaN(Number(showId))) {
      throw new Error(`Valid numeric Show ID is required, received: ${showId}`);
    }
    const response = await api.get(`/shows/${showId}`);
    return response.data;
  },

  async getSeatsForShow(showId) {
    if (!showId || isNaN(Number(showId))) {
      throw new Error(`Valid numeric Show ID is required, received: ${showId}`);
    }
    const response = await api.get(`/shows/${showId}/seats`);
    return response.data;
  },

  async getAllTheatres() {
    const response = await api.get('/theatres');
    return response.data;
  }
};
