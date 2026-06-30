const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tmdbMovieId: { type: Number, required: true },
  movieTitle: { type: String, required: true },
  moviePoster: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true, minlength: 10 },
  mediaType: { type: String, enum: ['film', 'serial'], default: 'film' }
}, { timestamps: true });

reviewSchema.index({ user: 1, tmdbMovieId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);