const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tmdbMovieId: { type: Number, required: true },
  movieTitle: { type: String, required: true },
  moviePoster: { type: String, default: '' },
  releaseYear: { type: String, default: '' }
}, { timestamps: true });

watchlistSchema.index({ user: 1, tmdbMovieId: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);