import { Autocomplete, Tooltip } from "@mui/material";
import StyledTextField from "./StyledTextField";
import React from "react";

/**
 * FilterField component.
 * @param {{
 *   label: string; // Label for field.
 *   setFilterValue: Function; // Setter for filter value stored in page state.
 *   filterValue: any; // Current value of filter
 *   options: Array<{label: string; value: any}>; // List of select options for field.
 *   [key: string]: any; // <= allows extra props like `groupBy`
 * }} props
 */
const FilterField = ({ 
    label, 
    setFilterValue, 
    filterValue, 
    options, 
    ...props 
}) => {
    return (
        <Autocomplete
            disablePortal
            options={options}
            value={options.find(option => option.value === filterValue) || null}
            onChange={(e, selectedOption) => {
                selectedOption === null ? setFilterValue(null) : setFilterValue(selectedOption.value)
            }}
            renderInput={(params) => {
                return (<Tooltip title={params.inputProps.value ? params.inputProps.value : undefined} placement="top">
                    <StyledTextField {...params} label={label} sx={{ marginBottom: 1, minWidth: 150 }} />
                </Tooltip>)
            }}
            {...props}
        />
    )
}

export default FilterField