import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <div className="logo-box">
          <i className="ti ti-movie" />
          <span className="logo-text">CineReview</span>
        </div>
      </Link>

      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          <i className="ti ti-home" /> Acasă
        </Link>
        <Link to="/filme" className={`nav-link ${isActive('/filme') ? 'active' : ''}`}>
          <i className="ti ti-movie" /> Filme
        </Link>
        <Link to="/seriale" className={`nav-link ${isActive('/seriale') ? 'active' : ''}`}>
          <i className="ti ti-device-tv" /> Seriale
        </Link>
        <Link to="/top250" className={`nav-link ${isActive('/top250') ? 'active' : ''}`}>
          <i className="ti ti-trophy" /> Top 250
        </Link>
       <Link to="/recomandari" className={`nav-link ${isActive('/recomandari') ? 'active' : ''}`}><i className="ti ti-sparkles" /> Recomandări
        </Link>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <Link to="/watchlist" className="btn-watchlist">
              <i className="ti ti-bookmark" /> Watchlist
            </Link>
            <Link to="/profil" className="nav-username">{user.username}</Link>
            <button className="btn-ghost" onClick={logout}>Ieși din cont</button>
          </>
        ) : (
          <>
            <Link to="/watchlist" className="btn-watchlist">
              <i className="ti ti-bookmark" /> Watchlist
            </Link>
            <Link to="/login" className="btn-ghost">Intră în cont</Link>
            <Link to="/register" className="btn-primary">Înregistrare</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;