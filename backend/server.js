const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const reviewRoutes = require('./routes/reviews');
const tvRoutes = require('./routes/tv');
const watchlistRoutes = require('./routes/watchlist');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/watchlist', watchlistRoutes);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectat la MongoDB'))
  .catch((err) => console.error('❌ Eroare MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/tv', tvRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'CineReview API funcționează! 🎬' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server pornit pe portul ${PORT}`));