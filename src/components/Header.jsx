import './Header.css';

/**
 * Header Component
 *
 * This component displays the application name and subtitle at the top of the page.
 * It's a presentational component with no state - just displays information passed via props.
 */
const Header = ({ subtitle }) => {
  return (
    <header className="app-header">
      {/* Main title with emoji icon */}
      <h1 className="app-title">🎬 Flixster</h1>

      {/* Subtitle - dynamically shows current mode (Now Playing or Search Results) */}
      <p className="app-subtitle">{subtitle}</p>
    </header>
  );
};

export default Header;
