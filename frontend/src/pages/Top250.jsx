import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MoviesPage.css';
import './Top250.css';

const IMG_BASE = 'https://image.tmdb.org/t/p/w342';

function Top250() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTop();
  }, []);

  const loadTop = async () => {
    setLoading(true);
    try {
      // Încarc mai multe pagini pentru a avea 250 de filme
      const pages = await Promise.all(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(p =>
          fetch(`http://localhost:5000/api/movies/discover?sort_by=vote_average.desc&vote_count.gte=1000&page=${p}`)
            .then(r => r.json())
        )
      );
      const all = pages.flatMap(p => p.results || []);
      setMovies(all.slice(0, 250));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="movies-page">
      <div className="page-header">
        <h1><i className="ti ti-trophy" /> Top 250 Filme</h1>
        <p className="page-sub">Cele mai bine cotate filme din toate timpurile</p>
      </div>

      {loading ? (
        <p className="loading-state">se încarcă top 250...</p>
      ) : (
        <div className="top-list">
          {movies.map((movie, index) => (
            <Link to={`/film/${movie.id}`} key={movie.id} className="top-item">
              <span className="top-rank">#{index + 1}</span>
              <div className="top-poster">
                {movie.poster_path
                  ? <img src={`${IMG_BASE}${movie.poster_path}`} alt={movie.title} loading="lazy" />
                  : <div className="poster-ph-sm">🎬</div>
                }
              </div>
              <div className="top-info">
                <p className="top-title">{movie.title}</p>
                <p className="top-meta">{movie.release_date?.split('-')[0]} · {movie.genre_ids?.slice(0,2).join(', ')}</p>
              </div>
              <div className="top-rating">
                <span className="rating-num">★ {movie.vote_average?.toFixed(1)}</span>
                <span className="vote-count">{(movie.vote_count / 1000).toFixed(0)}k voturi</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Top250;