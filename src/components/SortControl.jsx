import './SortControl.css';

/**
 * SortControl Component
 *
 * This component provides a dropdown menu for users to sort the movie list
 * by different criteria: title (A-Z), release date (newest first), or vote average (highest first).
 * It's a "controlled component" - the selected value is managed by the parent (App).
 */
const SortControl = ({ sortOption, onSortChange }) => {
  /**
   * Handle when the user selects a different sort option
   * This function extracts the new value and calls the parent's onSortChange function
   */
  const handleChange = (event) => {
    // event.target.value contains the selected option's value
    onSortChange(event.target.value);
  };

  return (
    <div className="sort-control">
      {/* Label for the dropdown (helps with accessibility) */}
      <label htmlFor="sort-select" className="sort-control__label">
        Sort by:
      </label>

      {/* Dropdown select element */}
      <select
        id="sort-select"
        value={sortOption} // Controlled: value is tied to parent state
        onChange={handleChange} // Update parent state when selection changes
        className="sort-control__select"
        aria-label="Sort movies by"
      >
        {/* Default option - no sorting applied */}
        <option value="default">Default</option>

        {/* Sort by title alphabetically (A-Z) */}
        <option value="title">Title (A-Z)</option>

        {/* Sort by release date (newest to oldest) */}
        <option value="release_date">Release Date (Newest)</option>

        {/* Sort by vote average (highest to lowest) */}
        <option value="vote_average">Rating (Highest)</option>
      </select>
    </div>
  );
};

export default SortControl;
