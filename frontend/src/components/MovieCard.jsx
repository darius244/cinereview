import { Link } from 'react-router-dom';
import './MovieCard.css';

const IMG_BASE = 'https://image.tmdb.org/t/p/w342';

function MovieCard({ movie }) {
  const { id, title, poster_path, vote_average, release_date, mediaType } = movie;
  const year = release_date?.split('-')[0];
  const url = mediaType === 'serial' ? `/serial/${id}` : `/film/${id}`;

  return (
    <Link to={url} className="movie-card">
      {poster_path ? (
        <img src={`${IMG_BASE}${poster_path}`} alt={title} loading="lazy" />
      ) : (
        <div className="poster-ph">🎬</div>
      )}
      {mediaType === 'serial' && (
        <span className="media-badge">Serial</span>
      )}
      <div className="rating-badge">★ {vote_average?.toFixed(1)}</div>
      <div className="movie-overlay">
        <p className="movie-title-ov">{title}</p>
        <p className="movie-year-ov">{year}</p>
      </div>
    </Link>
  );
}

export default MovieCard;