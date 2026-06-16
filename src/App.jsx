import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MovieList from './components/MovieList';
import SearchBar from './components/SearchBar';
import MovieModal from './components/MovieModal';
import SortControl from './components/SortControl';
import './App.css';

const App = () => {
  // ========== STATE MANAGEMENT ==========

  // Array to store the list of movies fetched from the API
  const [movies, setMovies] = useState([]);

  // Track the current page number for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Track the total number of pages available from the API
  const [totalPages, setTotalPages] = useState(1);

  // Track whether we're currently fetching data from the API
  const [loading, setLoading] = useState(false);

  // Store any error messages from failed API calls
  const [error, setError] = useState(null);

  // Track the ID of the movie selected for the modal (null when no modal is open)
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Store the current search query entered by the user
  const [searchQuery, setSearchQuery] = useState('');

  // Track whether we're in search mode or showing "Now Playing" movies
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Track the current sort option selected by the user
  const [sortOption, setSortOption] = useState('default');

  // Track which movies have been marked as favorites (array of movie IDs)
  const [favorites, setFavorites] = useState([]);

  // Track which movies have been marked as watched (array of movie IDs)
  const [watched, setWatched] = useState([]);

  // ========== API CONFIGURATION ==========

  // Get the API key from environment variables
  // This is stored in the .env file and accessed with import.meta.env in Vite
  const API_KEY = import.meta.env.VITE_API_KEY;

  // Base URL for all TMDb API requests
  const API_BASE_URL = 'https://api.themoviedb.org/3';

  /**
   * Fetch movies from the TMDb Search endpoint
   * This function is called when the user submits a search query
   *
   * @param {string} query - The search term entered by the user
   * @param {number} page - The page number to fetch
   * @param {boolean} append - If true, add new movies to existing list; if false, replace the list
   */
  const fetchSearchResults = async (query, page = 1, append = false) => {
    // Don't search if query is empty
    if (!query.trim()) {
      return;
    }

    // Don't fetch if we don't have an API key
    if (!API_KEY) {
      setError('API key is missing. Please add VITE_API_KEY to your .env file.');
      return;
    }

    // Set loading state to true
    setLoading(true);

    // Clear any previous errors
    setError(null);

    try {
      // Construct the search API URL
      // We need to encode the query in case it contains special characters or spaces
      const encodedQuery = encodeURIComponent(query);
      const url = `${API_BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodedQuery}&page=${page}`;

      // Make the API request
      const response = await fetch(url);

      // Check if the response was successful
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      // Parse the JSON response
      const data = await response.json();

      // Update state with the fetched data
      if (append) {
        // Append new movies to the existing list (for "Load More")
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
      } else {
        // Replace the entire movie list (for new search)
        setMovies(data.results);
      }

      // Update pagination info
      setCurrentPage(data.page);
      setTotalPages(data.total_pages);

      // If no results found, show a message
      if (data.results.length === 0 && !append) {
        setError(`No movies found for "${query}". Try a different search term.`);
      }
    } catch (err) {
      // If anything goes wrong, store the error message
      console.error('Error searching movies:', err);
      setError('Failed to search movies. Please try again later.');
    } finally {
      // Always set loading to false when done
      setLoading(false);
    }
  };

  /**
   * Fetch movies from the TMDb "Now Playing" endpoint
   * This function is called when the component first loads
   * and when the user clicks "Load More"
   *
   * @param {number} page - The page number to fetch
   * @param {boolean} append - If true, add new movies to existing list; if false, replace the list
   */
  const fetchNowPlayingMovies = async (page = 1, append = false) => {
    // Don't fetch if we don't have an API key
    if (!API_KEY) {
      setError('API key is missing. Please add VITE_API_KEY to your .env file.');
      return;
    }

    // Set loading state to true to show loading indicator
    setLoading(true);

    // Clear any previous errors
    setError(null);

    try {
      // Construct the API URL with query parameters
      // The ? starts the query string, & separates multiple parameters
      const url = `${API_BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`;

      // Make the API request using fetch
      const response = await fetch(url);

      // Check if the response was successful (status code 200-299)
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      // Parse the JSON response
      const data = await response.json();

      // Update state with the fetched data
      if (append) {
        // Append new movies to the existing list (for "Load More")
        // We use the spread operator (...) to create a new array with old and new movies
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
      } else {
        // Replace the entire movie list (for initial load)
        setMovies(data.results);
      }

      // Update pagination info
      setCurrentPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      // If anything goes wrong, store the error message
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Please try again later.');
    } finally {
      // Always set loading to false when done, whether successful or not
      setLoading(false);
    }
  };

  /**
   * useEffect hook runs when the component first mounts
   * This is where we fetch the initial list of movies
   */
  useEffect(() => {
    // Fetch the first page of "Now Playing" movies
    fetchNowPlayingMovies(1, false);
  }, []); // Empty dependency array means this runs once when component mounts

  /**
   * Handle "Load More" button click
   * Fetches the next page of movies and appends them to the list
   * Works for both "Now Playing" and search results
   */
  const handleLoadMore = () => {
    // Only load more if we haven't reached the last page
    if (currentPage < totalPages) {
      if (isSearchMode) {
        // If we're in search mode, fetch more search results
        fetchSearchResults(searchQuery, currentPage + 1, true);
      } else {
        // Otherwise, fetch more "Now Playing" movies
        fetchNowPlayingMovies(currentPage + 1, true);
      }
    }
  };

  /**
   * Handle search submission
   * Called when user clicks Search button or presses Enter
   *
   * @param {string} query - The search term entered by the user
   */
  const handleSearch = (query) => {
    // Store the search query in state
    setSearchQuery(query);

    // Switch to search mode
    setIsSearchMode(true);

    // Reset to page 1 for new search
    setCurrentPage(1);

    // Fetch search results (replace existing movies, don't append)
    fetchSearchResults(query, 1, false);
  };

  /**
   * Handle clear/reset
   * Called when user clicks Clear button or "Now Playing" button
   * Returns to showing "Now Playing" movies
   */
  const handleClear = () => {
    // Clear the search query
    setSearchQuery('');

    // Exit search mode
    setIsSearchMode(false);

    // Reset to page 1
    setCurrentPage(1);

    // Clear any errors
    setError(null);

    // Fetch "Now Playing" movies again (replace existing movies)
    fetchNowPlayingMovies(1, false);
  };

  /**
   * Handle when a movie card is clicked
   * This opens the modal to show detailed movie information
   *
   * @param {number} movieId - The ID of the clicked movie
   */
  const handleMovieClick = (movieId) => {
    // Store the selected movie ID - this will trigger the modal to open
    setSelectedMovieId(movieId);
  };

  /**
   * Handle closing the movie modal
   * Resets the selected movie ID to null
   */
  const handleCloseModal = () => {
    // Clear the selected movie ID - this will close the modal
    setSelectedMovieId(null);
  };

  /**
   * Toggle a movie's favorite status
   * If the movie is already favorited, remove it; otherwise add it
   *
   * @param {number} movieId - The ID of the movie to toggle
   */
  const handleToggleFavorite = (movieId) => {
    setFavorites((prevFavorites) => {
      // Check if the movie is already in favorites
      if (prevFavorites.includes(movieId)) {
        // Remove it from favorites (filter out this ID)
        return prevFavorites.filter((id) => id !== movieId);
      } else {
        // Add it to favorites (create new array with this ID added)
        return [...prevFavorites, movieId];
      }
    });
  };

  /**
   * Toggle a movie's watched status
   * If the movie is already marked as watched, remove it; otherwise add it
   *
   * @param {number} movieId - The ID of the movie to toggle
   */
  const handleToggleWatched = (movieId) => {
    setWatched((prevWatched) => {
      // Check if the movie is already in watched list
      if (prevWatched.includes(movieId)) {
        // Remove it from watched (filter out this ID)
        return prevWatched.filter((id) => id !== movieId);
      } else {
        // Add it to watched (create new array with this ID added)
        return [...prevWatched, movieId];
      }
    });
  };

  /**
   * Handle sort option change
   * Updates the sort option state when user selects a different sorting method
   *
   * @param {string} newSortOption - The selected sort option value
   */
  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
  };

  /**
   * Get sorted movies based on the current sort option
   * This function takes the movies array and returns a sorted copy
   * It doesn't mutate the original array - it creates a new one
   *
   * @returns {Array} Sorted array of movies
   */
  const getSortedMovies = () => {
    // Create a copy of the movies array to avoid mutating the original
    // The spread operator [...movies] creates a shallow copy
    const moviesCopy = [...movies];

    // Apply sorting based on the selected option
    switch (sortOption) {
      case 'title':
        // Sort alphabetically by title (A-Z)
        // localeCompare is a string comparison method that handles accents and special characters
        return moviesCopy.sort((a, b) => a.title.localeCompare(b.title));

      case 'release_date':
        // Sort by release date (newest first)
        // We convert the date strings to Date objects for proper comparison
        // Subtracting b - a gives us descending order (newest first)
        return moviesCopy.sort((a, b) => {
          const dateA = new Date(a.release_date);
          const dateB = new Date(b.release_date);
          return dateB - dateA;
        });

      case 'vote_average':
        // Sort by vote average (highest first)
        // Subtracting b - a gives us descending order (highest first)
        return moviesCopy.sort((a, b) => b.vote_average - a.vote_average);

      case 'default':
      default:
        // No sorting - return movies in original order from API
        return moviesCopy;
    }
  };

  // ========== RENDER ==========

  return (
    <div className="App">
      {/* App header - shows dynamic subtitle based on mode */}
      <Header
        subtitle={
          isSearchMode
            ? `Search Results for "${searchQuery}"`
            : 'Now Playing in Theaters'
        }
      />

      {/* Search bar */}
      <SearchBar onSearch={handleSearch} onClear={handleClear} />

      {/* Sort control */}
      <SortControl sortOption={sortOption} onSortChange={handleSortChange} />

      {/* Now Playing button - shows when in search mode */}
      {isSearchMode && (
        <div className="mode-toggle">
          <button onClick={handleClear} className="now-playing-button">
            ← Back to Now Playing
          </button>
        </div>
      )}

      {/* Show error message if there's an error */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Main content: MovieList component */}
      <main>
        <MovieList
          movies={getSortedMovies()} // Pass sorted movies instead of raw movies
          onMovieClick={handleMovieClick}
          onLoadMore={handleLoadMore}
          hasMore={currentPage < totalPages} // Can load more if not on last page
          loading={loading}
          favorites={favorites} // Pass favorites array
          watched={watched} // Pass watched array
          onToggleFavorite={handleToggleFavorite} // Pass favorite toggle handler
          onToggleWatched={handleToggleWatched} // Pass watched toggle handler
        />
      </main>

      {/* Movie Modal - only renders when a movie is selected */}
      <MovieModal movieId={selectedMovieId} onClose={handleCloseModal} />

      {/* App footer */}
      <Footer />
    </div>
  );
};

export default App;
