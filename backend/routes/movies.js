const express = require('express');
const router = express.Router();
const axios = require('axios');

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.TMDB_API_KEY;

router.get('/discover', async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/discover/movie`, {
      params: { api_key: TMDB_KEY, language: 'ro-RO', ...req.query }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la TMDB', error: err.message });
  }
});

router.get('/popular', async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/movie/popular`, {
      params: { api_key: TMDB_KEY, language: 'ro-RO', page: req.query.page || 1 }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la TMDB', error: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/search/movie`, {
      params: { api_key: TMDB_KEY, language: 'ro-RO', query: req.query.q }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la TMDB', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/movie/${req.params.id}`, {
      params: { api_key: TMDB_KEY, language: 'ro-RO', append_to_response: 'credits' }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la TMDB', error: err.message });
  }
});

module.exports = router;
