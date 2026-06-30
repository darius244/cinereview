import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import Profile from './pages/Profile';
import Watchlist from './pages/Watchlist';
import MoviesPage from './pages/MoviesPage';
import SerialsPage from './pages/SerialsPage';
import Top250 from './pages/Top250';
import SerialDetails from './pages/SerialDetails';
import Recommendations from './pages/Recommendations';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/filme" element={<MoviesPage />} />
            <Route path="/seriale" element={<SerialsPage />} />
            <Route path="/top250" element={<Top250 />} />
            <Route path="/recomandari" element={<Recommendations />} />
            <Route path="/film/:id" element={<MovieDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/serial/:id" element={<SerialDetails />} />

          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;