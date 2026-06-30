const express = require('express');
const router = express.Router();
const Watchlist = require('../models/Watchlist');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await Watchlist.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Eroare server', error: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tmdbMovieId, movieTitle, moviePoster, releaseYear } = req.body;
    const item = new Watchlist({ user: req.userId, tmdbMovieId, movieTitle, moviePoster, releaseYear });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Filmul e deja în watchlist' });
    res.status(500).json({ message: 'Eroare server', error: err.message });
  }
});

router.delete('/:tmdbMovieId', authMiddleware, async (req, res) => {
  try {
    await Watchlist.findOneAndDelete({ user: req.userId, tmdbMovieId: req.params.tmdbMovieId });
    res.json({ message: 'Șters din watchlist' });
  } catch (err) {
    res.status(500).json({ message: 'Eroare server', error: err.message });
  }
});

router.get('/check/:tmdbMovieId', authMiddleware, async (req, res) => {
  try {
    const item = await Watchlist.findOne({ user: req.userId, tmdbMovieId: req.params.tmdbMovieId });
    res.json({ inWatchlist: !!item });
  } catch (err) {
    res.status(500).json({ message: 'Eroare server', error: err.message });
  }
});

module.exports = router;