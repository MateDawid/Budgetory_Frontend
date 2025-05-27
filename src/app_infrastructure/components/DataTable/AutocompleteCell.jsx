import React from 'react';
import {Autocomplete, TextField} from "@mui/material";
import {useGridApiContext} from "@mui/x-data-grid";


/**
 * AutocompleteCell component to display Autocomplete field in DataGrid cell.
 * @param {object} params - Params for Autocomplete field. Contains:
 *  - {number} id - Edited object id.
 *  - {string} field - Edited field name.
 *  - {any} value - Current value of field.
 *  - {array} options - Options to be selected in field.
 *  - {string} labelField - Field containing label to be displayed for options.
 */
export default function AutocompleteCell(params) {
    const options = params.colDef.valueOptions
    const labelField = params.labelField || 'label'
    const apiRef = useGridApiContext();

    /**
     * AutocompleteCell component to display Autocomplete field in DataGrid cell.
     * @param {object} _ - Change event.
     * @param {number} newValue - New value for field.
     */
    const handleValueChange = (_, newValue) => {
        apiRef.current.setEditCellValue({
            id: params.id,
            field: params.field,
            value: typeof newValue === 'string' ? params.value : newValue?.value || '',
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
            value={options.find(option => option.value === params.value) || null}
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
                if (option && value) {
                    return option.value === value || option.value === value.value;
                }
                return false;
            }}
            onChange={handleValueChange}
            renderInput={(renderParams) => <TextField {...renderParams}/>}
        />
    )
}