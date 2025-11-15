import { Autocomplete} from "@mui/material"
import React from "react"
import { Controller } from "react-hook-form"
import StyledTextField from "../StyledTextField"

const SelectFormField = (
    {
        control,
        setValue,
        fieldName,
        fieldParams,
        fieldErrors,
        defaultValue,
        ...props
    }
) => {
    
    return (
        <Controller
            name={fieldName}
            control={control}
            defaultValue={defaultValue ? defaultValue : fieldParams.defaultValue}
            render={({ field }) => {
                // Find the actual option object from the value
                const selectedOption = field.value
                    ? fieldParams['options'].find(option =>
                        (option[fieldParams['selectValue']] || option.value) === field.value
                    ) || null
                    : null;

                return (
                    <Autocomplete
                        fullWidth
                        disabled={fieldParams.disabled}
                        options={fieldParams['options']}
                        groupBy={fieldParams['groupBy']}
                        value={selectedOption}
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
                        onChange={(_, newValue) => {
                            const selectedValue = newValue ? newValue[fieldParams['selectValue']] || newValue.value : null;
                            field.onChange(selectedValue);

                            // Clear dependent fields if specified
                            if (fieldParams.clearFieldsOnChange && Array.isArray(fieldParams.clearFieldsOnChange)) {
                                fieldParams.clearFieldsOnChange.forEach(dependentFieldName => {
                                    setValue(dependentFieldName, null);
                                });
                            }

                            // Call the custom onChange if provided
                            if (fieldParams.onChange) {
                                fieldParams.onChange(selectedValue);
                            }
                        }}
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
                                    ...fieldParams.slotProps,
                                    input: {
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {params.InputProps.endAdornment}
                                                {fieldParams.slotProps?.input?.endAdornment}
                                            </>
                                        )
                                        
                                    },
                                    
                                }}
                                sx={{ mb: 2 }}
                            />
                        )}
                    />
                );
            }}
            {...props}
        />
    )
}


export default SelectFormField;