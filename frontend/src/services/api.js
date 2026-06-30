const BASE_URL = 'http://localhost:5000/api';

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
});

// ---- AUTH ----
export const registerUser = async (username, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

// ---- MOVIES ----
export const getPopularMovies = async (page = 1) => {
  const res = await fetch(`${BASE_URL}/movies/popular?page=${page}`);
  return res.json();
};

export const searchMovies = async (query) => {
  const res = await fetch(`${BASE_URL}/movies/search?q=${encodeURIComponent(query)}`);
  return res.json();
};

export const searchAll = async (query) => {
  // Caută simultan filme și seriale
  const [moviesRes, tvRes] = await Promise.all([
    fetch(`${BASE_URL}/movies/search?q=${encodeURIComponent(query)}`).then(r => r.json()),
    fetch(`${BASE_URL}/tv/search?q=${encodeURIComponent(query)}`).then(r => r.json()),
  ]);

  const movies = (moviesRes.results || []).map(m => ({ ...m, mediaType: 'film' }));
  const tv = (tvRes.results || []).map(t => ({
    ...t,
    title: t.name,
    release_date: t.first_air_date,
    mediaType: 'serial'
  }));

  // Combinăm și sortăm după popularitate
  return {
    results: [...movies, ...tv].sort((a, b) => b.popularity - a.popularity)
  };
};

export const getMovieDetails = async (id) => {
  const res = await fetch(`${BASE_URL}/movies/${id}`);
  return res.json();
};

// ---- REVIEWS ----
export const getReviews = async (tmdbMovieId) => {
  const res = await fetch(`${BASE_URL}/reviews/${tmdbMovieId}`);
  return res.json();
};

export const addReview = async (reviewData, token) => {
  const res = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(reviewData)
  });
  return res.json();
};

export const deleteReview = async (reviewId, token) => {
  const res = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: authHeaders(token)
  });
  return res.json();
};