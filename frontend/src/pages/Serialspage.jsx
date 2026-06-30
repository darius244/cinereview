import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MoviesPage.css';

const GENRES = [
  { id: '', name: 'toate' },
  { id: '18', name: 'dramă' },
  { id: '35', name: 'comedie' },
  { id: '10765', name: 'sf & fantasy' },
  { id: '80', name: 'crimă' },
  { id: '10759', name: 'acțiune' },
  { id: '16', name: 'animație' },
  { id: '9648', name: 'mister' },
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularitate' },
  { value: 'vote_average.desc', label: 'Rating' },
  { value: 'first_air_date.desc', label: 'An (nou → vechi)' },
  { value: 'first_air_date.asc', label: 'An (vechi → nou)' },
  { value: 'name.asc', label: 'Titlu A-Z' },
];

const IMG_BASE = 'https://image.tmdb.org/t/p/w342';

function SerialsPage() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeGenre, setActiveGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [year, setYear] = useState('');

  useEffect(() => {
    loadShows();
  }, [page, activeGenre, sortBy, year]);

  const loadShows = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        sort_by: sortBy,
        ...(activeGenre && { with_genres: activeGenre }),
        ...(year && { first_air_date_year: year }),
      });
      const res = await fetch(`http://localhost:5000/api/tv/discover?${params}`);
      const data = await res.json();
      setShows(data.results || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="movies-page">
      <div className="page-header">
        <h1><i className="ti ti-device-tv" /> Seriale</h1>
      </div>

      <div className="controls-row">
        <div className="filters">
          {GENRES.map(g => (
            <span
              key={g.id}
              className={`flt ${activeGenre === g.id ? 'on' : ''}`}
              onClick={() => { setActiveGenre(g.id); setPage(1); }}
            >{g.name}</span>
          ))}
        </div>
        <div className="sort-controls">
          <select value={year} onChange={e => { setYear(e.target.value); setPage(1); }} className="select-input">
            <option value="">Orice an</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} className="select-input">
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="loading-state">se încarcă serialele...</p>
      ) : (
        <div className="film-grid">
          {shows.map(show => (
            <Link to={`/serial/${show.id}`} key={show.id} className="movie-card">
              {show.poster_path
                ? <img src={`${IMG_BASE}${show.poster_path}`} alt={show.name} loading="lazy" />
                : <div className="poster-ph">📺</div>
              }
              <div className="rating-badge">★ {show.vote_average?.toFixed(1)}</div>
              <div className="movie-overlay">
                <p className="movie-title-ov">{show.name}</p>
                <p className="movie-year-ov">{show.first_air_date?.split('-')[0]}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Anterior</button>
        <span>Pagina {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Următor →</button>
      </div>
    </div>
  );
}

export default SerialsPage;