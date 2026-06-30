import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getReviews, addReview } from '../services/api';
import StarRating from '../components/StarRating';
import './MovieDetails.css';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

function SerialDetails() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, [id]);
  useEffect(() => { if (user && token) checkWatchlist(); }, [user, id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [showRes, reviewsData] = await Promise.all([
        fetch(`http://localhost:5000/api/tv/${id}`).then(r => r.json()),
        getReviews(id)
      ]);
      setShow(showRes);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) { console.error(err); }
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
            movieTitle: show.name,
            moviePoster: show.poster_path,
            releaseYear: show.first_air_date?.split('-')[0]
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
      movieTitle: show.name,
      moviePoster: show.poster_path,
      rating,
      text: reviewText,
      mediaType: 'serial'
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
  if (!show) return <div className="details-loading">Serial negăsit.</div>;

  const year = show.first_air_date?.split('-')[0];

  return (
    <div className="details-page">
      <div className="details-hero" style={{
        backgroundImage: show.backdrop_path
          ? `linear-gradient(to bottom, rgba(13,17,23,0.6), #0d1117), url(https://image.tmdb.org/t/p/w1280${show.backdrop_path})`
          : 'none'
      }}>
        <div className="details-content">
          <div className="details-poster">
            {show.poster_path
              ? <img src={`${IMG_BASE}${show.poster_path}`} alt={show.name} />
              : <div className="poster-ph">📺</div>
            }
          </div>
          <div className="details-info">
            <h1>{show.name} <span className="year">({year})</span></h1>
            <div className="details-meta">
              {show.number_of_seasons && <span><i className="ti ti-list" /> {show.number_of_seasons} sezoane</span>}
              {show.number_of_episodes && <span><i className="ti ti-player-play" /> {show.number_of_episodes} ep.</span>}
              <span><i className="ti ti-star-filled" /> {show.vote_average?.toFixed(1)}</span>
              {show.genres?.map(g => <span key={g.id} className="genre-tag">{g.name}</span>)}
            </div>
            <p className="overview">{show.overview}</p>
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

export default SerialDetails;