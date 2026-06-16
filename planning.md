# Flixster Project Planning

## Component Architecture

### 1. App
- **Responsibility**: Main container component that manages global state and coordinates all other components
- **Renders**: Header, SearchBar, sort controls, MovieList, MovieModal, and Footer
- **Props**: None (root component)
- **State**: 
  - List of movies
  - Selected movie ID for modal
  - Current search query
  - Current page number
  - Sort option
  - Loading state
  - Error state

### 2. Header
- **Responsibility**: Display the application name/logo at the top of the page
- **Renders**: App title, optional logo, and optional tagline
- **Props**: None
- **State**: None (presentational component)

### 3. SearchBar
- **Responsibility**: Allow users to search for movies by title
- **Renders**: Text input field, search button, and clear button
- **Props**: 
  - `searchQuery` (string): Current search text
  - `onSearchChange` (function): Called when input value changes
  - `onSearch` (function): Called when user submits search
  - `onClear` (function): Called when user clears search
- **State**: None (controlled component - state managed by parent)

### 4. MovieList
- **Responsibility**: Display a grid of MovieCard components and handle "Load More" functionality
- **Renders**: Grid of MovieCard components and "Load More" button
- **Props**: 
  - `movies` (array): Array of movie objects to display
  - `onMovieClick` (function): Called when a movie card is clicked
  - `onLoadMore` (function): Called when "Load More" is clicked
  - `hasMore` (boolean): Whether more pages are available
  - `loading` (boolean): Whether data is being fetched
- **State**: None (data passed from parent)

### 5. MovieCard
- **Responsibility**: Display basic information about a single movie
- **Renders**: Movie poster image, title, and vote average
- **Props**: 
  - `movie` (object): Movie data containing title, poster_path, vote_average, id
  - `onClick` (function): Called when card is clicked
- **State**: None (presentational component)

### 6. MovieModal
- **Responsibility**: Display detailed information about a selected movie in an overlay
- **Renders**: Backdrop image, title, runtime, release date, genres, overview, AI watch recommendation, and close button
- **Props**: 
  - `movieId` (number or null): ID of movie to display (null when closed)
  - `onClose` (function): Called when modal should close
- **State**: 
  - Movie details (fetched from API)
  - Loading state for details
  - AI insight text
  - Loading state for AI insight
  - Error states

### 7. Footer
- **Responsibility**: Display copyright and attribution information
- **Renders**: Copyright notice and link to The Movie Database
- **Props**: None
- **State**: None (presentational component)

### 8. SortControl
- **Responsibility**: Allow users to sort movies by different criteria
- **Renders**: Dropdown select element with sort options
- **Props**: 
  - `sortOption` (string): Current sort selection
  - `onSortChange` (function): Called when sort option changes
- **State**: None (controlled component)

## Parent-Child Hierarchy
```
App
├── Header
├── SearchBar
├── SortControl
├── MovieList
│   └── MovieCard (multiple)
├── MovieModal
└── Footer
```

## API Contracts

### 1. TMDb Now Playing Endpoint
- **Purpose**: Fetch movies currently playing in theaters
- **URL**: `https://api.themoviedb.org/3/movie/now_playing`
- **Method**: GET
- **Required Parameters**:
  - `api_key` (string): Your TMDb API key
  - `page` (number): Page number for pagination (default: 1)
- **Optional Parameters**:
  - `language` (string): Language for results (default: en-US)
- **Response Fields Used**:
  - `results` (array): Array of movie objects
    - `id` (number): Unique movie identifier
    - `title` (string): Movie title
    - `poster_path` (string): Path to poster image
    - `vote_average` (number): Average rating (0-10)
    - `release_date` (string): Release date (YYYY-MM-DD)
  - `page` (number): Current page number
  - `total_pages` (number): Total number of pages available
- **Error Cases**:
  - 401: Invalid API key
  - 404: Resource not found
  - Network failure: Show user-friendly error message

### 2. TMDb Search Endpoint
- **Purpose**: Search for movies by title
- **URL**: `https://api.themoviedb.org/3/search/movie`
- **Method**: GET
- **Required Parameters**:
  - `api_key` (string): Your TMDb API key
  - `query` (string): Search term
  - `page` (number): Page number for pagination
- **Optional Parameters**:
  - `language` (string): Language for results
- **Response Fields Used**:
  - Same as Now Playing endpoint (results array with movie objects)
- **Error Cases**:
  - Empty query: Don't make request
  - 401: Invalid API key
  - 404: No results found (empty results array)

### 3. TMDb Movie Details Endpoint
- **Purpose**: Get detailed information about a specific movie
- **URL**: `https://api.themoviedb.org/3/movie/{movie_id}`
- **Method**: GET
- **Required Parameters**:
  - `api_key` (string): Your TMDb API key
  - `movie_id` (path parameter): ID of the movie
- **Response Fields Used**:
  - `id` (number): Movie ID
  - `title` (string): Movie title
  - `overview` (string): Movie description
  - `backdrop_path` (string): Path to backdrop image
  - `runtime` (number): Duration in minutes
  - `release_date` (string): Release date
  - `genres` (array): Array of genre objects with `id` and `name`
  - `vote_average` (number): Average rating
- **Error Cases**:
  - 404: Movie not found
  - 401: Invalid API key
  - Network failure: Show fallback message in modal

### 4. OpenRouter AI API Endpoint
- **Purpose**: Generate AI-powered watch recommendations
- **URL**: `https://openrouter.ai/api/v1/chat/completions`
- **Method**: POST
- **Required Headers**:
  - `Authorization`: Bearer {OPENROUTER_API_KEY}
  - `Content-Type`: application/json
- **Request Body**:
  - `model` (string): Model to use (e.g., "meta-llama/llama-3.3-70b-instruct:free")
  - `messages` (array): Array of message objects with role and content
- **Response Fields Used**:
  - `choices[0].message.content` (string): AI-generated recommendation text
- **Error Cases**:
  - 401: Invalid API key
  - 429: Rate limit exceeded
  - 500: Server error
  - Network failure: Display fallback message

## State Architecture

### Movies List State
- **Variable Name**: `movies`
- **Type**: Array of movie objects
- **Initial Value**: `[]`
- **Owner Component**: App
- **Update Trigger**: 
  - When Now Playing data is fetched (initial load)
  - When search results are fetched
  - When "Load More" appends new results
  - When sort option changes (sorted copy of existing array)

### Search Query State
- **Variable Name**: `searchQuery`
- **Type**: String
- **Initial Value**: `""`
- **Owner Component**: App
- **Update Trigger**: 
  - When user types in search input (every keystroke)
  - When user clears search (reset to empty string)

### Current Page State
- **Variable Name**: `currentPage`
- **Type**: Number
- **Initial Value**: `1`
- **Owner Component**: App
- **Update Trigger**: 
  - When "Load More" is clicked (increment by 1)
  - When new search is submitted (reset to 1)
  - When user returns to Now Playing (reset to 1)

### Total Pages State
- **Variable Name**: `totalPages`
- **Type**: Number
- **Initial Value**: `1`
- **Owner Component**: App
- **Update Trigger**: Set when API response is received (from `total_pages` field)

### Selected Movie ID State
- **Variable Name**: `selectedMovieId`
- **Type**: Number or null
- **Initial Value**: `null`
- **Owner Component**: App
- **Update Trigger**: 
  - When user clicks a MovieCard (set to movie's id)
  - When modal is closed (set to null)

### Sort Option State
- **Variable Name**: `sortOption`
- **Type**: String
- **Initial Value**: `"default"` (or "none")
- **Owner Component**: App
- **Update Trigger**: When user selects a different option from sort dropdown

### Loading State
- **Variable Name**: `loading`
- **Type**: Boolean
- **Initial Value**: `false`
- **Owner Component**: App
- **Update Trigger**: 
  - Set to `true` when API fetch begins
  - Set to `false` when fetch completes or errors

### Error State
- **Variable Name**: `error`
- **Type**: String or null
- **Initial Value**: `null`
- **Owner Component**: App
- **Update Trigger**: 
  - Set to error message when API call fails
  - Set to `null` when successful fetch occurs or user clears error

### Search Mode State
- **Variable Name**: `isSearchMode`
- **Type**: Boolean
- **Initial Value**: `false`
- **Owner Component**: App
- **Update Trigger**: 
  - Set to `true` when search is submitted
  - Set to `false` when returning to Now Playing or search is cleared

## Data Flow

### From API to MovieCard
1. **API Response**: TMDb API returns JSON with a `results` array containing movie objects
2. **State Update**: Raw movie objects are stored in the `movies` state array in the App component
3. **No Transformation Needed**: Movie data from API contains all fields needed by MovieCard (id, title, poster_path, vote_average)
4. **Props Passing**: App passes `movies` array to MovieList component
5. **Iteration**: MovieList uses `.map()` to iterate over movies array
6. **Individual Rendering**: For each movie object, MovieList renders a MovieCard component, passing the movie object as a prop
7. **Display**: MovieCard receives the movie prop and displays the poster image (constructed from base URL + poster_path), title, and vote_average

### From MovieCard Click to Modal Display
1. **Click Event**: User clicks on a MovieCard
2. **Event Handler**: onClick handler in MovieCard calls the `onMovieClick` function passed as a prop
3. **ID Propagation**: MovieCard passes the movie's `id` to the handler
4. **State Update**: App's click handler updates `selectedMovieId` state with the clicked movie's id
5. **Modal Rendering**: When `selectedMovieId` is not null, MovieModal is rendered
6. **Details Fetch**: MovieModal receives `movieId` prop and triggers a useEffect to fetch detailed movie data from the Movie Details endpoint
7. **Display Details**: Once fetched, MovieModal displays the detailed information including fields not in the original Now Playing response (runtime, genres)

## AI Feature Spec

### Overview
When a user opens a movie's detail modal, an AI-generated "Watch Recommendation" will be displayed alongside the movie details. This feature provides users with a personalized insight about whether the movie is worth watching.

### Prompt Spec

#### Role
You are an enthusiastic but honest film critic who helps people decide what to watch. You provide balanced recommendations that highlight what makes a movie worth watching while being truthful about its appeal.

#### Task
Write a 2-3 sentence watch recommendation for the movie. Focus on who would enjoy this film and why, or what makes it worth watching. Be specific to the movie's actual content.

#### Inputs
- **Title**: The movie's title
- **Genres**: Comma-separated list of genres (e.g., "Action, Adventure, Science Fiction")
- **Overview**: The movie's plot summary

#### Output Format
- Plain text response
- 2-3 complete sentences
- No first-person statements (no "I think", "I recommend")
- No spoilers beyond what's in the overview
- No generic phrases like "must-see" or "masterpiece" unless justified
- Focus on audience fit and specific appeal

#### Constraints
- Do not reveal plot details beyond the provided overview
- Do not compare to other films unless it genuinely helps (e.g., "fans of X will enjoy")
- Avoid marketing language or hyperbole
- Be honest - if a movie has niche appeal, say so
- Keep it concise and actionable

#### Failure Behavior
If the AI call fails for any reason (network error, rate limit, invalid response), display:
"We couldn't generate a recommendation right now. Check out the overview and details above to decide if this movie is right for you!"

### Technical Implementation

#### API Details
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Model**: `meta-llama/llama-3.3-70b-instruct:free` (free tier)
- **Authentication**: Bearer token in Authorization header
- **API Key**: Stored in `.env` as `VITE_OPENROUTER_API_KEY`

#### Request Structure
```javascript
{
  model: "meta-llama/llama-3.3-70b-instruct:free",
  messages: [
    {
      role: "system",
      content: "[System prompt with role and constraints]"
    },
    {
      role: "user",
      content: "[Task + movie context: title, genres, overview]"
    }
  ]
}
```

#### State Management
- **Component**: MovieModal (where AI insight will be displayed)
- **State Variables**:
  - `aiInsight` (string | null): Stores the AI-generated recommendation text
    - Initial value: `null`
    - Updated when AI response is received
    - Reset to `null` when modal closes
  - `loadingInsight` (boolean): Tracks whether AI call is in progress
    - Initial value: `false`
    - Set to `true` when fetch begins
    - Set to `false` when fetch completes (success or failure)

#### Trigger
- The AI call is triggered when the modal opens and movie details have been successfully fetched
- Implemented using `useEffect` with dependency on `movieId`
- Only makes one call per movie (no retry on failure to avoid rate limits)

#### Display
- **Location**: Inside MovieModal, below movie details
- **Loading State**: Shows "✨ Getting your personalized recommendation..." while loading
- **Success State**: Shows recommendation text with a heading "Watch Recommendation" or "AI Insight"
- **Error State**: Shows fallback message (defined in Failure Behavior above)
- **Styling**: Distinct visual styling to differentiate from movie details (e.g., different background color, border, or icon)

### AI Feature — Decisions Log

#### Implementation Summary
The AI watch recommendation feature was successfully integrated into the MovieModal component using the OpenRouter API with the free-tier Llama 3.3 70B model.

#### What the API Returned Initially
The API responses matched the specification well. The model generated 2-3 sentence recommendations that:
- Focused on audience fit and movie appeal
- Avoided first-person statements
- Stayed specific to the movie's content
- Maintained a balanced, honest tone

Example response for an action movie:
"This high-octane thriller delivers non-stop excitement for fans of fast-paced action and intricate heists. The chemistry between the leads and clever plot twists keep viewers engaged throughout. Perfect for an evening when you want pure entertainment without heavy drama."

#### What I Changed in My Prompt
The system prompt was refined to:
1. **Establish the role**: "enthusiastic but honest film critic"
2. **Set clear constraints**: No spoilers, no first-person, no generic phrases
3. **Define output format**: 2-3 sentences, focused on audience fit
4. **Emphasize specificity**: "Be specific to the movie's actual content"

The user prompt structure:
```
Write a watch recommendation for "[title]".
Genres: [genres].
Overview: [overview]
```

This structure gives the AI enough context without overwhelming it with unnecessary details.

#### What Fallback Behavior I Implemented
Two levels of fallback:
1. **Missing API key**: Returns immediately with fallback message (doesn't make API call)
2. **API failure** (network error, rate limit, invalid response): Catches error and returns user-friendly message:
   "We couldn't generate a recommendation right now. Check out the overview and details above to decide if this movie is right for you!"

The UI shows:
- Loading state: "Getting your personalized recommendation..."
- Success: AI-generated text in italic with gradient background
- Failure: Fallback message in lighter color

#### What I Learned

**1. Async State Management:**
- The AI call happens AFTER movie details are fetched (needs genre data)
- Used cleanup function in useEffect to reset AI state when modal closes
- Separate loading states for details and AI prevent UI confusion

**2. Prompt Engineering:**
- Specificity matters: "2-3 sentences" works better than "be brief"
- Negative constraints are important: telling the AI what NOT to do (no spoilers, no "I" statements)
- Context is key: providing genres helps the AI understand the movie's appeal

**3. Error Handling:**
- Never show raw error objects to users
- Distinguish between different failure types (missing key vs API error)
- Always provide a way forward (fallback message guides user to overview)

**4. API Integration:**
- OpenRouter uses the same structure as OpenAI's API (easy to switch providers)
- The free-tier model works well for this use case (no need for paid tier)
- Response structure: `data.choices[0].message.content`

**5. UX Considerations:**
- Loading state is important - AI calls take 2-5 seconds
- Distinct visual styling (gradient background) separates AI content from facts
- Italic text suggests "opinion" vs factual movie details

**6. Security Note:**
- API key is in .env and visible in browser (client-side limitation)
- For production, this should move to a backend server
- Rate limiting on OpenRouter account prevents abuse

## Breakpoints (Responsive Design)

### Mobile (< 600px)
- 1 movie card per row
- Stack search bar elements vertically
- Full-width modal with minimal padding

### Tablet (600px - 1024px)
- 2-3 movie cards per row
- Horizontal search bar layout
- Modal at 90% width

### Desktop (> 1024px)
- 4-5 movie cards per row
- Full horizontal layout with adequate spacing
- Modal at fixed max-width (e.g., 800px)

## Image Base URLs
- **Poster Images**: `https://image.tmdb.org/t/p/w500${poster_path}`
- **Backdrop Images**: `https://image.tmdb.org/t/p/original${backdrop_path}`
- **Fallback**: Use placeholder image or colored background when poster_path/backdrop_path is null
