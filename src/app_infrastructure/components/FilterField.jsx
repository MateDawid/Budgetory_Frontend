import { Autocomplete, Tooltip } from "@mui/material";
import StyledTextField from "./StyledTextField";
import React from "react";

/**
 * FilterField component.
 * @param {object} props
 * @param {string} props.label - Label for field.
 * @param {function} props.setFilterValue - Setter for filter value stored in page state.
 * @param {any} props.filterValue - Current value of filter
 * @param {object} props.options - List of select options for field.
 * @param {boolean} props.disabled - Handles 'disabled' param of Autocomplete.
 * @param {object} props.sx - Additional styling.
 */
const FilterField = ({ label, setFilterValue, filterValue, options, disabled = false, sx = {} }) => {
    return (
        <Autocomplete
            disablePortal
            options={options}
            value={options.find(option => option.value === filterValue) || null}
            onChange={(e, selectedOption) => {
                selectedOption === null ? setFilterValue(null) : setFilterValue(selectedOption.value)
            }}
            sx={sx}
            renderInput={(params) => {
                return (<Tooltip title={params.inputProps.value ? params.inputProps.value : undefined} placement="top">
                    <StyledTextField {...params} label={label} sx={{ marginBottom: 1, minWidth: 150 }} />
                </Tooltip>)
            }}
            disabled={disabled}
        />
    )
}

export default FilterField