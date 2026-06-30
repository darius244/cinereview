import { useState, useEffect } from 'react';
import { searchAll } from '../services/api';
import MovieCard from '../components/MovieCard';
import './Home.css';

const GENRES = [
  { id: '', name: 'toate' },
  { id: '28', name: 'acțiune' },
  { id: '18', name: 'dramă' },
  { id: '35', name: 'comedie' },
  { id: '878', name: 'sf' },
  { id: '27', name: 'horror' },
];

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeGenre, setActiveGenre] = useState('');

  useEffect(() => {
    loadMovies();
  }, [page, activeGenre]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        sort_by: 'popularity.desc',
        ...(activeGenre && { with_genres: activeGenre }),
      });
      const res = await fetch(`http://localhost:5000/api/movies/discover?${params}`);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
  e.preventDefault();
  if (!search.trim()) return loadMovies();
  setLoading(true);
  const data = await searchAll(search);
  setMovies(data.results || []);
  setLoading(false);
};

  const handleGenre = (id) => {
    setActiveGenre(id);
    setPage(1);
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-eyebrow">
          <i className="ti ti-star" /> recenzii autentice de la cinefili
        </div>
        <h1>Recenzează. Notează.<br /><span>Descoperă.</span></h1>
        <p className="hero-sub">Spune-ți părerea despre filmele pe care le-ai văzut</p>
        <form className="search-row" onSubmit={handleSearch}>
          <i className="ti ti-search" />
          <input
            placeholder="Caută un film sau serial..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="search-btn">caută</button>
        </form>
      </div>

      <div className="section">
        <div className="sec-head">
          <span className="sec-title">filme populare</span>
          <span className="see-all">vezi toate →</span>
        </div>
        <div className="filters">
          {GENRES.map(g => (
            <span
              key={g.id}
              className={`flt ${activeGenre === g.id ? 'on' : ''}`}
              onClick={() => handleGenre(g.id)}
            >{g.name}</span>
          ))}
        </div>
        {loading ? (
          <p className="loading-state">se încarcă posterele...</p>
        ) : (
          <div className="film-grid">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
        {!search && (
          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Anterior</button>
            <span>Pagina {page}</span>
            <button onClick={() => setPage(p => p + 1)}>Următor →</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;