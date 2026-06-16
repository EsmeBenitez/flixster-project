import { useState } from 'react';
import './SearchBar.css';

/**
 * SearchBar Component
 *
 * This component provides a search interface for users to search for movies by title.
 * It includes a text input, search button, and clear button.
 * The input is "controlled" - meaning React manages its value through state.
 */
const SearchBar = ({ onSearch, onClear }) => {
  // Local state to track what the user has typed in the input field
  // This is managed locally because the parent (App) only needs the final search query,
  // not every keystroke
  const [inputValue, setInputValue] = useState('');

  /**
   * Handle changes to the input field
   * This function is called on every keystroke
   */
  const handleInputChange = (event) => {
    // event.target.value contains the current text in the input
    setInputValue(event.target.value);
  };

  /**
   * Handle form submission (when user presses Enter or clicks Search button)
   * This prevents the default form behavior (page reload) and calls the onSearch function
   */
  const handleSubmit = (event) => {
    // Prevent the form from reloading the page (default form behavior)
    event.preventDefault();

    // Only search if there's actually text in the input
    // trim() removes whitespace from beginning and end
    if (inputValue.trim()) {
      // Call the onSearch function passed from the parent (App) with the search query
      onSearch(inputValue.trim());
    }
  };

  /**
   * Handle the Clear button click
   * This clears the input and calls the parent's onClear function
   */
  const handleClear = () => {
    // Clear the local input value
    setInputValue('');

    // Call the onClear function from parent to reset search and show Now Playing movies
    onClear();
  };

  return (
    <div className="search-bar">
      {/* Form element to enable Enter key submission */}
      <form onSubmit={handleSubmit} className="search-bar__form">
        {/* Text input for search query */}
        <input
          type="text"
          value={inputValue} // Controlled input: value is tied to state
          onChange={handleInputChange} // Update state on every keystroke
          placeholder="Search for a movie..."
          className="search-bar__input"
          aria-label="Search for movies" // Accessibility: screen readers will read this
        />

        {/* Search button */}
        <button
          type="submit" // type="submit" triggers the form's onSubmit
          className="search-bar__button search-bar__button--search"
          disabled={!inputValue.trim()} // Disable if input is empty or only whitespace
        >
          🔍 Search
        </button>

        {/* Clear button */}
        <button
          type="button" // type="button" prevents form submission
          onClick={handleClear}
          className="search-bar__button search-bar__button--clear"
          disabled={!inputValue} // Disable if input is already empty
        >
          ✖ Clear
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
