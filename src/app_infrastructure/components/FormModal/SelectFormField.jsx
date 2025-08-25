import { Autocomplete } from "@mui/material"
import React from "react"
import { Controller } from "react-hook-form"
import StyledTextField from "../StyledTextField"

const SelectFormField = (
    {
        control,
        fieldName,
        fieldParams,
        fieldErrors,
        defaultValue,
        disabledFields
    }
) => {


    return (
        <Controller
            name={fieldName}
            control={control}
            defaultValue={defaultValue ? defaultValue : fieldParams.defaultValue}
            disabled={disabledFields.includes(fieldName)}
            render={({ field }) => (
                <Autocomplete
                    {...field}
                    fullWidth
                    options={fieldParams['options']}
                    getOptionLabel={(selectedOption) => {
                        if (selectedOption === "") {
                            return selectedOption
                        }
                        else if (typeof selectedOption === 'object') {
                            return selectedOption[fieldParams['selectLabel']] || selectedOption.label || ''
                        } else {
                            const displayOption = fieldParams['options'].find(option => option[fieldParams['selectValue']] === selectedOption || option.value === selectedOption)
                            if (displayOption) {
                                return displayOption[fieldParams['selectLabel']] || displayOption.label
                            } else {
                                console.error(`ERROR: Wrong setup for field ${fieldName} - check "selectValue" and "selectLabel" definitions.`)
                                return '?'
                            }
                        }
                    }}
                    isOptionEqualToValue={(option, value) => {
                        if (option && value) {
                            return option[fieldParams['selectValue']] === value || option.value === value;
                        }
                        return false;
                    }}
                    onChange={(_, newValue) => field.onChange(newValue ? newValue[fieldParams['selectValue']] || newValue.value : null)}
                    renderInput={(params) => (
                        <StyledTextField
                            {...params}
                            label={fieldParams.label}
                            required={fieldParams.required}
                            error={!!fieldErrors[fieldName]}
                            helperText={fieldErrors[fieldName] ? fieldErrors[fieldName] : ''}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                                ...fieldParams.slotProps
                            }}
                            sx={{ mb: 2 }}
                        />
                    )}
                />
            )}
        />
    )
}


export default SelectFormField;