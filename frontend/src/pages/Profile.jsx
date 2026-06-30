import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import StarRating from '../components/StarRating';
import './Profile.css';

const IMG_BASE = 'https://image.tmdb.org/t/p/w342';

function Profile() {
  const { user, token, logout } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recenzii');

  useEffect(() => {
    if (user && token) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [revRes, watchRes] = await Promise.all([
        fetch('http://localhost:5000/api/reviews/my', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()),
        fetch('http://localhost:5000/api/watchlist', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()),
      ]);
      setReviews(Array.isArray(revRes) ? revRes : []);
      setWatchlist(Array.isArray(watchRes) ? watchRes : []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const deleteReview = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {}
  };

  if (!user) {
    return (
      <div className="profile-empty">
        <i className="ti ti-user-off" />
        <h2>Nu ești autentificat</h2>
        <Link to="/login" className="btn-primary">Intră în cont</Link>
      </div>
    );
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.username?.[0]?.toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p>{user.email}</p>
        </div>
        <button className="btn-logout" onClick={logout}>
          <i className="ti ti-logout" /> Ieși din cont
        </button>
      </div>

      <div className="profile-stats">
        <div className="stat-box">
          <span className="stat-num">{reviews.length}</span>
          <span className="stat-lbl">Recenzii</span>
        </div>
        <div className="stat-box">
          <span className="stat-num">{watchlist.length}</span>
          <span className="stat-lbl">Watchlist</span>
        </div>
        <div className="stat-box">
          <span className="stat-num">{avgRating}</span>
          <span className="stat-lbl">Rating mediu dat</span>
        </div>
      </div>

      <div className="profile-tabs">
        <button className={`tab-btn ${activeTab === 'recenzii' ? 'active' : ''}`} onClick={() => setActiveTab('recenzii')}>
          <i className="ti ti-star" /> Recenzii ({reviews.length})
        </button>
        <button className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`} onClick={() => setActiveTab('watchlist')}>
          <i className="ti ti-bookmark" /> Watchlist ({watchlist.length})
        </button>
      </div>

      {loading ? (
        <p className="loading-state">se încarcă...</p>
      ) : activeTab === 'recenzii' ? (
        reviews.length === 0 ? (
          <div className="profile-empty" style={{ minHeight: '40vh' }}>
            <i className="ti ti-movie" />
            <h2>Nicio recenzie încă</h2>
            <p>Caută un film și lasă prima ta recenzie!</p>
            <Link to="/" className="btn-primary">Descoperă filme</Link>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map(r => (
              <div key={r._id} className="review-card">
                <Link
                  to={r.mediaType === 'serial' ? `/serial/${r.tmdbMovieId}` : `/film/${r.tmdbMovieId}`}
                  className="review-card-poster"
                >
                  {r.moviePoster
                    ? <img src={`${IMG_BASE}${r.moviePoster}`} alt={r.movieTitle} />
                    : <div className="poster-ph-sm">🎬</div>
                  }
                </Link>
                <div className="review-card-body">
                  <Link
                    to={r.mediaType === 'serial' ? `/serial/${r.tmdbMovieId}` : `/film/${r.tmdbMovieId}`}
                    className="review-card-title"
                  >
                    {r.movieTitle}
                  </Link>
                  <StarRating value={r.rating} readOnly />
                  <p className="review-card-text">{r.text}</p>
                  <div className="review-card-footer">
                    <span className="review-card-date">{new Date(r.createdAt).toLocaleDateString('ro-RO')}</span>
                    <button className="btn-delete-review" onClick={() => deleteReview(r._id)}>
                      <i className="ti ti-trash" /> Șterge
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        watchlist.length === 0 ? (
          <div className="profile-empty" style={{ minHeight: '40vh' }}>
            <i className="ti ti-bookmark" />
            <h2>Watchlist-ul tău e gol</h2>
            <Link to="/" className="btn-primary">Descoperă filme</Link>
          </div>
        ) : (
          <div className="watchlist-grid-profile">
            {watchlist.map(item => (
              <Link to={`/film/${item.tmdbMovieId}`} key={item._id} className="watchlist-card-sm">
                {item.moviePoster
                  ? <img src={`${IMG_BASE}${item.moviePoster}`} alt={item.movieTitle} />
                  : <div className="poster-ph-sm">🎬</div>
                }
                <p className="watchlist-title-sm">{item.movieTitle}</p>
                <p className="watchlist-year-sm">{item.releaseYear}</p>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default Profile;