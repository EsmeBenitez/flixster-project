import './Footer.css';

/**
 * Footer Component
 *
 * This component displays copyright information and attribution links at the bottom of the page.
 * Including a link to TMDb is required when using their API and data.
 * It's a presentational component with no state.
 */
const Footer = () => {
  // Get the current year for the copyright notice
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        {/* Copyright notice */}
        <p className="footer-text">
          © {currentYear} Flixster. All rights reserved.
        </p>

        {/* Attribution to The Movie Database (required for using TMDb API) */}
        <p className="footer-text">
          Movie data provided by{' '}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            The Movie Database (TMDb)
          </a>
        </p>

        {/* Optional: Link to project repository */}
        <p className="footer-text">
          Built with ❤️ using React
        </p>
      </div>
    </footer>
  );
};

export default Footer;
