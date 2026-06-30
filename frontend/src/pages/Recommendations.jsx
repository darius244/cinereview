import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import './Recommendations.css';

const GENRE_MAP = {
  'Action': '28', 'Adventure': '12', 'Animation': '16', 'Comedy': '35',
  'Crime': '80', 'Documentary': '99', 'Drama': '18', 'Family': '10751',
  'Fantasy': '14', 'History': '36', 'Horror': '27', 'Music': '10402',
  'Mystery': '9648', 'Romance': '10749', 'Science Fiction': '878',
  'Thriller': '53', 'War': '10752', 'Western': '37',
  'Acțiune': '28', 'Animație': '16', 'Comedie': '35', 'Crimă': '80',
  'Dramă': '18', 'Familie': '10751', 'Fantezie': '14', 'Groază': '27',
  'Mister': '9648', 'SF': '878', 'Război': '10752',
};

const TV_GENRE_MAP = {
  'Action': '10759', 'Adventure': '10759', 'Animation': '16', 'Comedy': '35',
  'Crime': '80', 'Documentary': '99', 'Drama': '18', 'Family': '10751',
  'Fantasy': '10765', 'History': '36', 'Horror': '9648', 'Music': '10402',
  'Mystery': '9648', 'Romance': '10749', 'Science Fiction': '10765',
  'Thriller': '80', 'War': '10768', 'Western': '37',
  'Acțiune': '10759', 'Animație': '16', 'Comedie': '35', 'Crimă': '80',
  'Dramă': '18', 'Familie': '10751', 'Fantezie': '10765', 'Groază': '9648',
  'Mister': '9648', 'SF': '10765', 'Război': '10768',
};

function Recommendations() {
  const { user, token } = useAuth();
  const [recMovies, setRecMovies] = useState([]);
  const [recTV, setRecTV] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('filme');

  useEffect(() => {
    if (user && token) loadRecommendations();
    else setLoading(false);
  }, [user]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const revRes = await fetch('http://localhost:5000/api/reviews/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const reviews = await revRes.json();

      if (!Array.isArray(reviews) || reviews.length === 0) {
        setError('no-reviews');
        setLoading(false);
        return;
      }

      const goodReviews = reviews.filter(r => r.rating >= 4);
      if (goodReviews.length === 0) {
        setError('no-good-reviews');
        setLoading(false);
        return;
      }

      const movieIds = goodReviews.map(r => r.tmdbMovieId);

      // Ia detaliile filmelor apreciate
      const movieDetails = await Promise.all(
        movieIds.slice(0, 5).map(id =>
          fetch(`http://localhost:5000/api/movies/${id}`)
            .then(r => r.json())
            .catch(() => null)
        )
      );

      // Numără genurile
      const genreCount = {};
      movieDetails.forEach(movie => {
        if (!movie || !movie.genres) return;
        movie.genres.forEach(g => {
          genreCount[g.name] = (genreCount[g.name] || 0) + 1;
        });
      });

      const sortedGenres = Object.entries(genreCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => name);

      setTopGenres(sortedGenres);

      const alreadyReviewed = new Set(movieIds.map(String));

      // Gen IDs separate pentru filme și seriale
      const movieGenreIds = sortedGenres
        .map(g => GENRE_MAP[g])
        .filter(Boolean)
        .join('|'); // OR logic — mai permisiv

      const tvGenreIds = sortedGenres
        .map(g => TV_GENRE_MAP[g])
        .filter(Boolean)
        .join('|');

      const [moviesRes, tvRes] = await Promise.all([
        movieGenreIds
          ? fetch(`http://localhost:5000/api/movies/discover?with_genres=${movieGenreIds}&sort_by=vote_average.desc&vote_count.gte=200&page=1`)
              .then(r => r.json())
          : { results: [] },
        tvGenreIds
          ? fetch(`http://localhost:5000/api/tv/discover?with_genres=${tvGenreIds}&sort_by=vote_average.desc&vote_count.gte=100&page=1`)
              .then(r => r.json())
          : { results: [] },
      ]);

      const filteredMovies = (moviesRes.results || [])
        .filter(m => !alreadyReviewed.has(String(m.id)))
        .slice(0, 10);

      const filteredTV = (tvRes.results || [])
        .map(t => ({ ...t, title: t.name, release_date: t.first_air_date, mediaType: 'serial' }))
        .filter(t => t.poster_path)
        .slice(0, 10);

      setRecMovies(filteredMovies);
      setRecTV(filteredTV);
    } catch (err) {
      console.error(err);
      setError('error');
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="rec-page">
        <div className="rec-empty">
          <i className="ti ti-user-off" />
          <h2>Trebuie să fii autentificat</h2>
          <p>Intră în cont pentru a vedea recomandări personalizate.</p>
          <Link to="/login" className="btn-primary">Intră în cont</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rec-page">
        <div className="rec-loading">
          <div className="rec-spinner" />
          <p>Se analizează preferințele tale...</p>
        </div>
      </div>
    );
  }

  if (error === 'no-reviews') {
    return (
      <div className="rec-page">
        <div className="rec-empty">
          <i className="ti ti-movie" />
          <h2>Nicio recenzie încă</h2>
          <p>Lasă cel puțin o recenzie cu rating ≥ 4 stele ca să primești recomandări.</p>
          <Link to="/" className="btn-primary">Descoperă filme</Link>
        </div>
      </div>
    );
  }

  if (error === 'no-good-reviews') {
    return (
      <div className="rec-page">
        <div className="rec-empty">
          <i className="ti ti-star-off" />
          <h2>Nicio recenzie pozitivă</h2>
          <p>Dă rating de 4-5 stele filmelor preferate ca să generăm recomandări.</p>
          <Link to="/" className="btn-primary">Descoperă filme</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rec-page">
      <div className="rec-header">
        <h1><i className="ti ti-sparkles" /> Recomandate pentru tine</h1>
        <p className="rec-sub">Bazat pe filmele pe care le-ai apreciat</p>
      </div>

      {topGenres.length > 0 && (
        <div className="rec-genres">
          <span className="rec-genres-label">Genurile tale preferate:</span>
          {topGenres.map(g => (
            <span key={g} className="rec-genre-tag">{g}</span>
          ))}
        </div>
      )}

      <div className="rec-tabs">
        <button className={`rec-tab ${activeTab === 'filme' ? 'active' : ''}`} onClick={() => setActiveTab('filme')}>
          <i className="ti ti-movie" /> Filme ({recMovies.length})
        </button>
        <button className={`rec-tab ${activeTab === 'seriale' ? 'active' : ''}`} onClick={() => setActiveTab('seriale')}>
          <i className="ti ti-device-tv" /> Seriale ({recTV.length})
        </button>
      </div>

      {activeTab === 'filme' ? (
        recMovies.length === 0 ? (
          <div className="rec-empty" style={{ minHeight: '40vh' }}>
            <i className="ti ti-mood-sad" />
            <h2>Nu am găsit filme recomandate</h2>
          </div>
        ) : (
          <div className="film-grid">
            {recMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )
      ) : (
        recTV.length === 0 ? (
          <div className="rec-empty" style={{ minHeight: '40vh' }}>
            <i className="ti ti-mood-sad" />
            <h2>Nu am găsit seriale recomandate</h2>
          </div>
        ) : (
          <div className="film-grid">
            {recTV.map(show => (
              <MovieCard key={show.id} movie={show} />
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default Recommendations;