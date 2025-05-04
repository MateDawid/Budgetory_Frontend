import {Autocomplete} from "@mui/material";
import StyledTextField from "./StyledTextField";
import React from "react";

/**
 * SearchField component to display search field for list pages.
 * @param {string} label - Label for field.
 * @param {function} setFilterValue - Setter for filter value stored in page state.
 * @param {object} options - List of select options for field.
 * @param {object} sx - Additional styling.
 */
const FilterField = ({label, setFilterValue, options, sx={}}) => (
    <Autocomplete
        disablePortal
        options={options}
        onChange={(e, selectedOption) => {
            selectedOption === null ? setFilterValue(null) : setFilterValue(selectedOption.value)
        }}
        sx={sx}
        renderInput={(params) => <StyledTextField {...params} label={label} sx={{marginBottom: 0}}/>}
    />)

export default FilterField