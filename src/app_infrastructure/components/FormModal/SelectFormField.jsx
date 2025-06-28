import { Autocomplete } from "@mui/material"
import React from "react"
import { Controller } from "react-hook-form"
import StyledTextField from "../StyledTextField"

const SelectFormField = (
    {
        control,
        fields,
        fieldName,
        fieldErrors
    }
) => {
    return (
        <Controller
            name={fieldName}
            control={control}
            defaultValue=""
            render={({ field }) => (
                <Autocomplete
                    {...field}
                    fullWidth
                    options={fields[fieldName]['options']}
                    getOptionLabel={(selectedOption) => {
                        if (selectedOption === "") {
                            return selectedOption
                        }
                        else if (typeof selectedOption === 'object') {
                            return selectedOption[fields[fieldName]['selectLabel']] || selectedOption.label || ''
                        } else {
                            const displayOption = fields[fieldName]['options'].find(option => option[fields[fieldName]['selectValue']] === selectedOption || option.value === selectedOption)
                            if (displayOption) {
                                return displayOption[fields[fieldName]['selectLabel']] || displayOption.label
                            } else {
                                console.error(`ERROR: Wrong setup for field ${fieldName} - check "selectValue" and "selectLabel" definitions.`)
                                return '?'
                            }
                        }
                    }}
                    isOptionEqualToValue={(option, value) => {
                        if (option && value) {
                            return option[fields[fieldName]['selectValue']] === value || option.value === value;
                        }
                        return false;
                    }}
                    onChange={(_, newValue) => field.onChange(newValue ? newValue[fields[fieldName]['selectValue']] || newValue.value : null)}
                    renderInput={(params) => (
                        <StyledTextField
                            {...params}
                            label={fields[fieldName].label}
                            required={fields[fieldName].required}
                            error={!!fieldErrors[fieldName]}
                            helperText={fieldErrors[fieldName] ? fieldErrors[fieldName] : ''}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                                ...fields[fieldName].slotProps
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