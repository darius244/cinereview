import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import './MoviesPage.css';

const GENRES = [
  { id: '', name: 'toate' },
  { id: '28', name: 'acțiune' },
  { id: '18', name: 'dramă' },
  { id: '35', name: 'comedie' },
  { id: '878', name: 'sf' },
  { id: '27', name: 'horror' },
  { id: '10749', name: 'romantic' },
  { id: '53', name: 'thriller' },
  { id: '16', name: 'animație' },
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularitate' },
  { value: 'vote_average.desc', label: 'Rating' },
  { value: 'primary_release_date.desc', label: 'An (nou → vechi)' },
  { value: 'primary_release_date.asc', label: 'An (vechi → nou)' },
  { value: 'title.asc', label: 'Titlu A-Z' },
];

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeGenre, setActiveGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [year, setYear] = useState('');

  useEffect(() => {
    loadMovies();
  }, [page, activeGenre, sortBy, year]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        sort_by: sortBy,
        ...(activeGenre && { with_genres: activeGenre }),
        ...(year && { primary_release_year: year }),
      });
      const res = await fetch(`http://localhost:5000/api/movies/discover?${params}`);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleGenre = (id) => {
    setActiveGenre(id);
    setPage(1);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleYear = (e) => {
    setYear(e.target.value);
    setPage(1);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="movies-page">
      <div className="page-header">
        <h1><i className="ti ti-movie" /> Filme</h1>
      </div>

      <div className="controls-row">
        <div className="filters">
          {GENRES.map(g => (
            <span
              key={g.id}
              className={`flt ${activeGenre === g.id ? 'on' : ''}`}
              onClick={() => handleGenre(g.id)}
            >{g.name}</span>
          ))}
        </div>
        <div className="sort-controls">
          <select value={year} onChange={handleYear} className="select-input">
            <option value="">Orice an</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={sortBy} onChange={handleSort} className="select-input">
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="loading-state">se încarcă filmele...</p>
      ) : (
        <div className="film-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
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

export default MoviesPage;