import { useState, useEffect } from 'react';
import './MovieModal.css';

/**
 * MovieModal Component
 *
 * This component displays detailed information about a selected movie in a modal overlay.
 * It fetches additional movie details (runtime, genres) from the TMDb Movie Details API
 * since this information isn't included in the Now Playing or Search endpoints.
 */
const MovieModal = ({ movieId, onClose }) => {
  // ========== STATE MANAGEMENT ==========

  // Store the detailed movie data fetched from the API
  const [movieDetails, setMovieDetails] = useState(null);

  // Track whether we're currently fetching movie details
  const [loading, setLoading] = useState(false);

  // Store any error messages from failed API calls
  const [error, setError] = useState(null);

  // Store the AI-generated watch recommendation
  const [aiInsight, setAiInsight] = useState(null);

  // Track whether we're currently fetching the AI insight
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Store the YouTube trailer key (for embedding)
  const [trailerKey, setTrailerKey] = useState(null);

  // ========== API CONFIGURATION ==========

  // Get the API key from environment variables
  const API_KEY = import.meta.env.VITE_API_KEY;

  // Base URL for TMDb API
  const API_BASE_URL = 'https://api.themoviedb.org/3';

  // Get the OpenRouter API key for AI features
  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

  /**
   * Fetch AI-powered watch recommendation from OpenRouter API
   * This function takes movie information and generates a personalized recommendation
   *
   * @param {string} title - Movie title
   * @param {string} genres - Comma-separated list of genres
   * @param {string} overview - Movie plot summary
   * @returns {string} AI-generated recommendation or fallback message
   */
  const getMovieInsight = async (title, genres, overview) => {
    // Check if we have the API key
    if (!OPENROUTER_API_KEY) {
      console.error('OpenRouter API key is missing');
      return 'AI recommendations are currently unavailable. Check out the overview above!';
    }

    // TEMPORARY: Mock response for testing (uncomment to avoid API calls)
    // return `This ${genres.toLowerCase()} film offers engaging entertainment for fans of the genre. The story combines ${overview.slice(0, 50)}... with compelling performances. Perfect for viewers looking for a well-crafted movie experience.`;

    try {
      // Set loading state
      setLoadingInsight(true);

      // Make API request to OpenRouter
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemma-4-26b-a4b-it:free', // Google Gemma 4 26B A4B
          messages: [
            {
              role: 'system',
              content: `You are an enthusiastic but honest film critic who helps people decide what to watch.
              You provide balanced recommendations that highlight what makes a movie worth watching while being truthful about its appeal.
              Write 2-3 sentences focusing on who would enjoy this film and why, or what makes it worth watching.
              Be specific to the movie's actual content. Do not use first-person statements like "I think" or "I recommend".
              Do not reveal plot details beyond the provided overview. Keep it concise and actionable.
              Avoid generic phrases like "must-see" or "masterpiece" unless justified.`,
            },
            {
              role: 'user',
              content: `Write a watch recommendation for "${title}".
              Genres: ${genres}.
              Overview: ${overview}`,
            },
          ],
        }),
      });

      // Check if response was successful
      if (!response.ok) {
        throw new Error(`OpenRouter error: ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();

      // Extract the AI-generated text from the response
      // The response structure is: data.choices[0].message.content
      return data.choices[0].message.content;
    } catch (err) {
      // Log error for debugging
      console.error('AI insight failed:', err);

      // Return a user-friendly fallback message
      return "We couldn't generate a recommendation right now. Check out the overview and details above to decide if this movie is right for you!";
    } finally {
      // Always set loading to false when done
      setLoadingInsight(false);
    }
  };

  /**
   * Fetch detailed information about a specific movie
   * This runs whenever the movieId changes (when a different movie is selected)
   */
  useEffect(() => {
    // Only fetch if we have a valid movie ID
    if (!movieId) {
      return;
    }

    // Define an async function to fetch movie details
    const fetchMovieDetails = async () => {
      // Check if we have an API key
      if (!API_KEY) {
        setError('API key is missing.');
        return;
      }

      // Set loading state to true
      setLoading(true);

      // Clear any previous errors
      setError(null);

      try {
        // Construct the URL for the Movie Details endpoint
        // The movie ID is part of the URL path, not a query parameter
        const url = `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`;

        // Make the API request
        const response = await fetch(url);

        // Check if the response was successful
        if (!response.ok) {
          throw new Error(`Failed to fetch movie details: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Store the movie details in state
        setMovieDetails(data);

        // Fetch the movie's trailer video from TMDb
        // This is a separate API call to get videos (trailers, teasers, etc.)
        try {
          const videosUrl = `${API_BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`;
          const videosResponse = await fetch(videosUrl);

          if (videosResponse.ok) {
            const videosData = await videosResponse.json();

            // Find the official trailer from the videos list
            // We prioritize videos that are:
            // 1. Type: "Trailer"
            // 2. Site: "YouTube"
            // 3. Official: true
            const trailer = videosData.results.find(
              (video) =>
                video.type === 'Trailer' &&
                video.site === 'YouTube' &&
                video.official === true
            );

            // If no official trailer, try to find any trailer
            const anyTrailer = videosData.results.find(
              (video) => video.type === 'Trailer' && video.site === 'YouTube'
            );

            // Store the YouTube video key (used to embed the video)
            if (trailer) {
              setTrailerKey(trailer.key);
            } else if (anyTrailer) {
              setTrailerKey(anyTrailer.key);
            } else {
              setTrailerKey(null); // No trailer available
            }
          }
        } catch (err) {
          console.error('Error fetching trailer:', err);
          setTrailerKey(null); // Set to null if fetch fails
        }

        // After successfully fetching movie details, generate AI insight
        // We need the details first to have genres information
        if (data.genres && data.title && data.overview) {
          // Convert genres array to comma-separated string
          // Example: [{name: "Action"}, {name: "Adventure"}] → "Action, Adventure"
          const genreNames = data.genres.map((genre) => genre.name).join(', ');

          // Fetch the AI insight
          const insight = await getMovieInsight(data.title, genreNames, data.overview);

          // Store the AI insight in state
          setAiInsight(insight);
        }
      } catch (err) {
        // If anything goes wrong, store the error message
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again.');
      } finally {
        // Always set loading to false when done
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchMovieDetails();

    // Cleanup function: reset AI insight and trailer when modal closes or movie changes
    return () => {
      setAiInsight(null);
      setLoadingInsight(false);
      setTrailerKey(null);
    };
  }, [movieId, API_KEY]); // Re-run this effect if movieId or API_KEY changes

  // ========== HELPER FUNCTIONS ==========

  /**
   * Format runtime from minutes to hours and minutes
   * Example: 148 minutes → "2h 28m"
   */
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  /**
   * Format release date to a more readable format
   * Example: "2024-03-15" → "March 15, 2024"
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Get the full URL for the backdrop image
   */
  const getBackdropUrl = (backdropPath) => {
    if (!backdropPath) return null;
    return `https://image.tmdb.org/t/p/original${backdropPath}`;
  };

  /**
   * Handle clicking outside the modal content to close it
   */
  const handleBackdropClick = (event) => {
    // Only close if the user clicked on the backdrop itself, not the modal content
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  /**
   * Handle pressing the Escape key to close the modal
   */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Add event listener when modal opens
    document.addEventListener('keydown', handleEscape);

    // Clean up: remove event listener when modal closes
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // ========== RENDER ==========

  // Don't render anything if there's no movie ID
  if (!movieId) {
    return null;
  }

  return (
    // Backdrop: semi-transparent overlay that covers the entire screen
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal content container */}
      <div className="modal-content">
        {/* Close button (X) in top-right corner */}
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Loading state */}
        {loading && (
          <div className="modal-loading">
            <p>Loading movie details...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="modal-error">
            <p>{error}</p>
          </div>
        )}

        {/* Movie details - only show when data is loaded */}
        {movieDetails && !loading && !error && (
          <>
            {/* Backdrop image at the top */}
            {movieDetails.backdrop_path && (
              <div className="modal-backdrop-image">
                <img
                  src={getBackdropUrl(movieDetails.backdrop_path)}
                  alt={`${movieDetails.title} backdrop`}
                  className="backdrop-img"
                />
              </div>
            )}

            {/* Movie information section */}
            <div className="modal-body">
              {/* Title */}
              <h2 id="modal-title" className="modal-title">
                {movieDetails.title}
              </h2>

              {/* Metadata: rating, runtime, release date */}
              <div className="modal-metadata">
                <span className="modal-rating">
                  ⭐ {movieDetails.vote_average.toFixed(1)}
                </span>
                <span className="modal-divider">•</span>
                <span className="modal-runtime">
                  {formatRuntime(movieDetails.runtime)}
                </span>
                <span className="modal-divider">•</span>
                <span className="modal-release-date">
                  {formatDate(movieDetails.release_date)}
                </span>
              </div>

              {/* Genres */}
              {movieDetails.genres && movieDetails.genres.length > 0 && (
                <div className="modal-genres">
                  {/* Map through the genres array and create a tag for each */}
                  {movieDetails.genres.map((genre) => (
                    <span key={genre.id} className="genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Embedded YouTube Trailer */}
              {trailerKey && (
                <div className="modal-trailer">
                  <h3>Official Trailer</h3>
                  <div className="modal-trailer__container">
                    {/*
                      YouTube embed iframe
                      - src: YouTube embed URL with the video key
                      - frameBorder: Remove default border
                      - allow: Enable fullscreen and other features
                      - allowFullScreen: Allow fullscreen mode
                      - title: Accessibility - describes the iframe content
                    */}
                    <iframe
                      className="modal-trailer__video"
                      src={`https://www.youtube.com/embed/${trailerKey}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`${movieDetails.title} Trailer`}
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Overview/Description */}
              {movieDetails.overview && (
                <div className="modal-overview">
                  <h3>Overview</h3>
                  <p>{movieDetails.overview}</p>
                </div>
              )}

              {/* AI Watch Recommendation Section */}
              <div className="modal-ai-section">
                <h3 className="modal-ai-title">✨ AI Watch Recommendation</h3>

                {/* Loading state for AI insight */}
                {loadingInsight && (
                  <div className="modal-ai-loading">
                    <p>Getting your personalized recommendation...</p>
                  </div>
                )}

                {/* Display AI insight when loaded */}
                {!loadingInsight && aiInsight && (
                  <div className="modal-ai-content">
                    <p>{aiInsight}</p>
                  </div>
                )}

                {/* Fallback if AI insight is null and not loading */}
                {!loadingInsight && !aiInsight && (
                  <div className="modal-ai-fallback">
                    <p>Recommendation unavailable. Check out the overview above!</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
