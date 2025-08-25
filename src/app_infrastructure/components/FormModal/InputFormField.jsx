import React from "react"
import StyledTextField from "../StyledTextField"

const InputFormField = (
    {
        register,
        fieldName,
        fieldParams,
        fieldErrors,
        defaultValue,
        disabledFields
    }
) => {
    return (
        <StyledTextField
            {...fieldParams}
            {...register(fieldName)}
            slotProps={{
                inputLabel: {
                    shrink: true,
                },
                ...fieldParams.slotProps
            }}
            inputProps={fieldParams['type'] === 'date' ? { max: '9999-12-31' } : {}}
            fullWidth
            defaultValue={defaultValue ? defaultValue : ""}
            error={!!fieldErrors[fieldName]}
            helperText={fieldErrors[fieldName] ? fieldErrors[fieldName] : ''}
            sx={{ mb: 2 }}
            disabled={disabledFields.includes(fieldName)}
        />
    )
}


export default InputFormField;