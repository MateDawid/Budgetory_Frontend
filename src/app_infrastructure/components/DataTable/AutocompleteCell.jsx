import React from 'react';
import {Autocomplete, TextField} from "@mui/material";
import {useGridApiContext} from "@mui/x-data-grid";


/**
 * AutocompleteCell component to display Autocomplete field in DataGrid cell.
 * @param {number} id - Edited object id.
 * @param {string} field - Edited field name.
 * @param {any} value - Current value of field.
 * @param {array} options - Options to be selected in field.
 * @param {string} labelField - Field containing label to be displayed for options.
 */
export default function AutocompleteCell({id, field, value, options, labelField}) {
    const apiRef = useGridApiContext();

    /**
     * AutocompleteCell component to display Autocomplete field in DataGrid cell.
     * @param {object} _ - Change event.
     * @param {number} newValue - New value for field.
     */
    const handleValueChange = (_, newValue) => {
        apiRef.current.setEditCellValue({
            id,
            field,
            value: typeof newValue === 'string' ? value : newValue?.value || '',
        });
    };

    return (
        <Autocomplete
            sx={{
                '& .MuiAutocomplete-inputRoot': {
                    fontSize: "0.875rem",
                    height: '100%',
                },
                '& .MuiFormControl-root': {
                    height: '100%',
                }
                }}
            value={options.find(option => option.value === value) || null}
            options={options}
            fullWidth
            getOptionLabel={(selectedOption) => {
                if (typeof selectedOption === 'object') {
                    return selectedOption[labelField]
                } else if (typeof selectedOption === 'number') {
                    const displayOption = options.find(option => option.id === selectedOption)
                    if (displayOption) {
                        return displayOption[labelField]
                    } else {
                        console.error(`ERROR: Label for selected option not found - check "labelField" definition.`)
                        return '?'
                    }
                }
                return ""
            }}
            isOptionEqualToValue={(option, value) => {
                console.log(option.value,  value)
                if (option && value) {
                    return option.value === value || option.value === value.value;
                }
                return false;
            }}
            onChange={handleValueChange}
            renderInput={(params) => <TextField {...params} sx={{height: "50%"}}/>}
        />
    )
}