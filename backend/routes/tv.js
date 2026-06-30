const express = require('express');
const router = express.Router();
const axios = require('axios');

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_KEY = process.env.TMDB_API_KEY;

// GET /api/tv/discover
router.get('/discover', async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/discover/tv`, {
      params: { api_key: TMDB_KEY, language: 'ro-RO', ...req.query }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la TMDB', error: err.message });
  }
});

// GET /api/tv/search
router.get('/search', async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/search/tv`, {
      params: { api_key: TMDB_KEY, language: 'ro-RO', query: req.query.q }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la TMDB', error: err.message });
  }
});

// GET /api/tv/:id
router.get('/:id', async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/tv/${req.params.id}`, {
      params: { api_key: TMDB_KEY, language: 'ro-RO' }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la TMDB', error: err.message });
  }
});

module.exports = router;