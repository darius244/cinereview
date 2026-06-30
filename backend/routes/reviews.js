const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/reviews/my — recenziile userului logat
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Eroare server', error: err.message });
  }
});

// GET /api/reviews/:tmdbMovieId
router.get('/:tmdbMovieId', async (req, res) => {
  try {
    const reviews = await Review.find({ tmdbMovieId: req.params.tmdbMovieId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Eroare server', error: err.message });
  }
});

// POST /api/reviews
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tmdbMovieId, movieTitle, moviePoster, rating, text, mediaType } = req.body;
    const review = new Review({
      user: req.userId,
      tmdbMovieId,
      movieTitle,
      moviePoster,
      rating,
      text,
      mediaType: mediaType || 'film'
    });
    await review.save();
    await review.populate('user', 'username');
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Ai lăsat deja un review pentru acest film' });
    res.status(500).json({ message: 'Eroare server', error: err.message });
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review negăsit' });
    if (review.user.toString() !== req.userId) return res.status(403).json({ message: 'Nu poți șterge review-ul altcuiva' });
    await review.deleteOne();
    res.json({ message: 'Review șters' });
  } catch (err) {
    res.status(500).json({ message: 'Eroare server', error: err.message });
  }
});

module.exports = router;