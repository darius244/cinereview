import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Watchlist.css';

const IMG_BASE = 'https://image.tmdb.org/t/p/w342';

function Watchlist() {
  const { user, token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) loadWatchlist();
    else setLoading(false);
  }, [user]);

  const loadWatchlist = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/watchlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const removeFromWatchlist = async (tmdbMovieId) => {
    try {
      await fetch(`http://localhost:5000/api/watchlist/${tmdbMovieId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(items.filter(i => i.tmdbMovieId !== tmdbMovieId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="watchlist-empty">
        <i className="ti ti-bookmark" />
        <h2>Trebuie să fii autentificat</h2>
        <p>Intră în cont pentru a-ți vedea watchlist-ul.</p>
        <Link to="/login" className="btn-primary">Intră în cont</Link>
      </div>
    );
  }

  if (loading) return <div className="watchlist-page"><p className="loading-state">se încarcă...</p></div>;

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <h1><i className="ti ti-bookmark" /> Watchlist</h1>
        <p>{items.length} {items.length === 1 ? 'film' : 'filme'}</p>
      </div>

      {items.length === 0 ? (
        <div className="watchlist-empty">
          <i className="ti ti-movie-off" />
          <h2>Watchlist-ul tău e gol</h2>
          <p>Adaugă filme din pagina unui film apăsând pe <strong>+ Watchlist</strong>.</p>
          <Link to="/" className="btn-primary">Descoperă filme</Link>
        </div>
      ) : (
        <div className="watchlist-grid">
          {items.map(item => (
            <div key={item._id} className="watchlist-card">
              <Link to={`/film/${item.tmdbMovieId}`}>
                {item.moviePoster
                  ? <img src={`${IMG_BASE}${item.moviePoster}`} alt={item.movieTitle} />
                  : <div className="poster-ph">🎬</div>
                }
              </Link>
              <div className="watchlist-card-info">
                <p className="watchlist-title">{item.movieTitle}</p>
                <p className="watchlist-year">{item.releaseYear}</p>
                <button
                  className="btn-remove"
                  onClick={() => removeFromWatchlist(item.tmdbMovieId)}
                >
                  <i className="ti ti-trash" /> Șterge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;