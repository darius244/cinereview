import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-box">
              <i className="ti ti-movie" />
              <span className="footer-logo-text">CineReview</span>
            </div>
          </div>
          <p className="footer-tagline">
            Recenzează, notează și descoperă filme alături de o comunitate de cinefili.
          </p>
          <p className="footer-data">
            Date despre filme furnizate de <span>TMDB</span>
          </p>
        </div>

        <div className="footer-links-group">
          <div className="footer-col">
            <h4>Platformă</h4>
            <a href="#">Despre noi</a>
            <a href="#">Noutăți</a>
            <a href="#">API</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Cont</h4>
            <a href="#">Înregistrare</a>
            <a href="#">Autentificare</a>
            <a href="#">Watchlist</a>
            <a href="#">Profil</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Termeni</a>
            <a href="#">Confidențialitate</a>
            <a href="#">Cookie-uri</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          © 2026 <span>CineReview</span>. Toate drepturile rezervate.
        </p>
        <div className="footer-socials">
          <i className="ti ti-brand-instagram" />
          <i className="ti ti-brand-x" />
          <i className="ti ti-brand-facebook" />
          <i className="ti ti-brand-tiktok" />
          <i className="ti ti-brand-youtube" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;