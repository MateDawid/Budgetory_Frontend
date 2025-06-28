import React from "react"
import StyledTextField from "../StyledTextField"

const InputFormField = (
    {
        register,
        fields,
        fieldName,
        fieldErrors
    }
) => {
    return (
        <StyledTextField
            {...fields[fieldName]}
            {...register(fieldName)}
            slotProps={{
                inputLabel: {
                    shrink: true,
                },
                ...fields[fieldName].slotProps
            }}
            inputProps={fields[fieldName]['type'] === 'date' ? { max: '9999-12-31' } : {}}
            fullWidth
            error={!!fieldErrors[fieldName]}
            helperText={fieldErrors[fieldName] ? fieldErrors[fieldName] : ''}
            sx={{ mb: 2 }}
        />
    )
}


export default InputFormField;