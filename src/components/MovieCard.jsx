import './MovieCard.css';

/**
 * MovieCard Component
 *
 * This component displays basic information about a single movie.
 * It shows the movie's poster image, title, and average rating.
 * It also includes buttons to mark the movie as a favorite or watched.
 * When clicked, it triggers the onClick function passed from the parent component.
 */
const MovieCard = ({
  movie,
  onClick,
  isFavorite,
  isWatched,
  onToggleFavorite,
  onToggleWatched
}) => {
  // Base URL for TMDb poster images (w500 means width of 500px)
  const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  // Construct the full image URL, or use a placeholder if no poster exists
  const posterUrl = movie.poster_path
    ? `${POSTER_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  /**
   * Handle when the movie card is clicked
   * This will call the onClick function from the parent and pass the movie's id
   */
  const handleClick = () => {
    onClick(movie.id);
  };

  /**
   * Handle favorite button click
   * Stops event propagation so clicking the heart doesn't open the modal
   */
  const handleFavoriteClick = (e) => {
    // Stop the event from bubbling up to the card's onClick
    e.stopPropagation();
    onToggleFavorite(movie.id);
  };

  /**
   * Handle watched button click
   * Stops event propagation so clicking the eye doesn't open the modal
   */
  const handleWatchedClick = (e) => {
    // Stop the event from bubbling up to the card's onClick
    e.stopPropagation();
    onToggleWatched(movie.id);
  };

  return (
    // The card is clickable, so we use a div with onClick handler
    // We also add keyboard support by making it focusable and handling Enter key
    <div
      className="movie-card"
      onClick={handleClick}
      onKeyDown={(e) => {
        // Allow Enter key to activate the card (accessibility feature)
        if (e.key === 'Enter') {
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${movie.title}`}
    >
      {/* Movie poster image */}
      <div className="movie-card__poster-container">
        <img
          src={posterUrl}
          alt={`${movie.title} poster`}
          className="movie-card__poster"
        />

        {/* Action buttons overlay on poster */}
        <div className="movie-card__actions">
          {/* Favorite button (heart icon) */}
          <button
            className={`movie-card__action-btn ${
              isFavorite ? 'movie-card__action-btn--active' : ''
            }`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {/* Show filled heart if favorited, outline heart if not */}
            {isFavorite ? '❤️' : '🤍'}
          </button>

          {/* Watched button (eye icon) */}
          <button
            className={`movie-card__action-btn ${
              isWatched ? 'movie-card__action-btn--active' : ''
            }`}
            onClick={handleWatchedClick}
            aria-label={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
            title={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
          >
            {/* Show filled eye if watched, outline eye if not */}
            {isWatched ? '👁️' : '👀'}
          </button>
        </div>
      </div>

      {/* Card content: title and rating */}
      <div className="movie-card__content">
        <h3 className="movie-card__title">{movie.title}</h3>

        {/* Vote average displayed with a star icon */}
        <div className="movie-card__rating">
          <span className="movie-card__star">⭐</span>
          {/* toFixed(1) formats the rating to 1 decimal place (e.g., 7.5) */}
          <span className="movie-card__score">{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
