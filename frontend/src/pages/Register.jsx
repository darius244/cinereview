import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = await registerUser(username, email, password);
    if (data.token) {
      login(data.user, data.token);
      navigate('/');
    } else {
      setError(data.message || 'Eroare la înregistrare');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <i className="ti ti-movie" />
          <span>CineReview</span>
        </div>
        <h2>Creează cont</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <i className="ti ti-user" />
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="input-group">
            <i className="ti ti-mail" />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <i className="ti ti-lock" />
            <input type="password" placeholder="Parolă" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Se creează contul...' : 'Înregistrare'}
          </button>
        </form>
        <p className="auth-switch">Ai deja cont? <Link to="/login">Intră în cont</Link></p>
      </div>
    </div>
  );
}

export default Register;