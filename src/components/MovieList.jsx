import MovieCard from './MovieCard';
import './MovieList.css';

/**
 * MovieList Component
 *
 * This component displays a grid of MovieCard components.
 * It receives movie data from the parent component (App) and renders each movie as a card.
 * It also handles the "Load More" button for pagination.
 */
const MovieList = ({
  movies,
  onMovieClick,
  onLoadMore,
  hasMore,
  loading,
  favorites,
  watched,
  onToggleFavorite,
  onToggleWatched
}) => {
  return (
    <div className="movie-list-container">
      {/* Show loading message when data is being fetched */}
      {loading && movies.length === 0 && (
        <div className="movie-list__loading">
          <p>Loading movies...</p>
        </div>
      )}

      {/* Show message if no movies are found */}
      {!loading && movies.length === 0 && (
        <div className="movie-list__empty">
          <p>No movies found. Try a different search!</p>
        </div>
      )}

      {/* Movie grid - only show if there are movies */}
      {movies.length > 0 && (
        <>
          <div className="movie-list">
            {/*
              Loop through each movie in the movies array and create a MovieCard for it
              The map() function creates a new MovieCard component for each movie object
            */}
            {movies.map((movie) => (
              <MovieCard
                key={movie.id} // Unique key for React to track each card
                movie={movie} // Pass the entire movie object as a prop
                onClick={onMovieClick} // Pass the click handler from parent
                isFavorite={favorites.includes(movie.id)} // Check if this movie is favorited
                isWatched={watched.includes(movie.id)} // Check if this movie is watched
                onToggleFavorite={onToggleFavorite} // Pass favorite toggle handler
                onToggleWatched={onToggleWatched} // Pass watched toggle handler
              />
            ))}
          </div>

          {/* Load More button section */}
          <div className="movie-list__load-more">
            {/* Only show the Load More button if there are more pages available */}
            {hasMore && (
              <button
                onClick={onLoadMore}
                disabled={loading} // Disable button while loading
                className="load-more-button"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            )}

            {/* Show a message when all movies have been loaded */}
            {!hasMore && !loading && (
              <p className="movie-list__end-message">
                You've reached the end! No more movies to load.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MovieList;
