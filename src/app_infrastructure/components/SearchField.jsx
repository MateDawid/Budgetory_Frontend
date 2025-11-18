import React from 'react';
import StyledTextField from './StyledTextField';

/**
 * SearchField component to display search field for list pages.
 * @param {string} label - Label for field.
 * @param {function} setSearchQuery - Setter for search query stored in page state.
 * @param {object} sx - Additional styling.
 */
const SearchField = ({ label, setSearchQuery, sx = {} }) => (
  <StyledTextField
    onInput={(e) => {
      setTimeout(() => {
        setSearchQuery(e.target.value);
      }, 1000);
    }}
    label={label}
    sx={sx}
    variant="outlined"
  />
);

export default SearchField;
