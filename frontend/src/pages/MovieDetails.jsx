import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getReviews, addReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import './MovieDetails.css';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

function MovieDetails() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (user && token) checkWatchlist();
  }, [user, id]);

  const loadData = async () => {
    setLoading(true);
    const [movieData, reviewsData] = await Promise.all([
      getMovieDetails(id),
      getReviews(id)
    ]);
    setMovie(movieData);
    setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    setLoading(false);
  };

  const checkWatchlist = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/watchlist/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setInWatchlist(data.inWatchlist);
    } catch (err) {}
  };

  const toggleWatchlist = async () => {
    if (!user) return alert('Trebuie să fii autentificat!');
    setWatchlistLoading(true);
    try {
      if (inWatchlist) {
        await fetch(`http://localhost:5000/api/watchlist/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        setInWatchlist(false);
      } else {
        await fetch('http://localhost:5000/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            tmdbMovieId: Number(id),
            movieTitle: movie.title,
            moviePoster: movie.poster_path,
            releaseYear: movie.release_date?.split('-')[0]
          })
        });
        setInWatchlist(true);
      }
    } catch (err) {}
    setWatchlistLoading(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating) return setError('Alege un rating între 1 și 5 stele.');
    if (reviewText.trim().length < 10) return setError('Recenzia trebuie să aibă minim 10 caractere.');
    setSubmitting(true);
    setError('');
    const result = await addReview({
      tmdbMovieId: id,
      movieTitle: movie.title,
      moviePoster: movie.poster_path,
      rating,
      text: reviewText
    }, token);
    if (result._id) {
      setReviews([result, ...reviews]);
      setRating(0);
      setReviewText('');
    } else {
      setError(result.message || 'Eroare la trimiterea recenziei.');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="details-loading">Se încarcă...</div>;
  if (!movie) return <div className="details-loading">Film negăsit.</div>;

  const year = movie.release_date?.split('-')[0];
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';

  return (
    <div className="details-page">
      <div className="details-hero" style={{
        backgroundImage: movie.backdrop_path
          ? `linear-gradient(to bottom, rgba(13,17,23,0.6), #0d1117), url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
          : 'none'
      }}>
        <div className="details-content">
          <div className="details-poster">
            {movie.poster_path
              ? <img src={`${IMG_BASE}${movie.poster_path}`} alt={movie.title} />
              : <div className="poster-ph">🎬</div>
            }
          </div>
          <div className="details-info">
            <h1>{movie.title} <span className="year">({year})</span></h1>
            <div className="details-meta">
              {runtime && <span><i className="ti ti-clock" /> {runtime}</span>}
              <span><i className="ti ti-star-filled" /> {movie.vote_average?.toFixed(1)}</span>
              {movie.genres?.map(g => <span key={g.id} className="genre-tag">{g.name}</span>)}
            </div>
            <p className="overview">{movie.overview}</p>
            <button
              className={`btn-watchlist-add ${inWatchlist ? 'in-watchlist' : ''}`}
              onClick={toggleWatchlist}
              disabled={watchlistLoading}
            >
              <i className={`ti ${inWatchlist ? 'ti-bookmark-filled' : 'ti-bookmark-plus'}`} />
              {watchlistLoading ? 'Se procesează...' : inWatchlist ? 'În Watchlist' : '+ Watchlist'}
            </button>
          </div>
        </div>
      </div>

      <div className="details-body">
        {user ? (
          <div className="review-form-box">
            <h3>Lasă o recenzie</h3>
            <form onSubmit={handleSubmitReview}>
              <StarRating value={rating} onChange={setRating} />
              <textarea
                placeholder="Scrie recenzia ta... (minim 10 caractere)"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? 'Se trimite...' : 'Publică recenzia'}
              </button>
            </form>
          </div>
        ) : (
          <div className="login-prompt">
            <p>Trebuie să fii autentificat pentru a lăsa o recenzie.</p>
          </div>
        )}

        <div className="reviews-list">
          <h3>Recenzii ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <p className="no-reviews">Fii primul care lasă o recenzie!</p>
          ) : (
            reviews.map(r => (
              <div key={r._id} className="review-item">
                <div className="rev-avatar">{r.user?.username?.[0]?.toUpperCase()}</div>
                <div className="rev-body">
                  <div className="rev-top">
                    <span className="rev-name">{r.user?.username}</span>
                    <StarRating value={r.rating} readOnly />
                    <span className="rev-date">{new Date(r.createdAt).toLocaleDateString('ro-RO')}</span>
                  </div>
                  <p className="rev-text">{r.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;