import { Box, Typography, Alert } from "@mui/material"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import StyledButton from "../StyledButton"
import StyledModal from "../StyledModal"
import SelectFormField from "./SelectFormField"
import InputFormField from "./InputFormField"
import ApiError from "../../utils/ApiError"
import { useContext } from "react"
import { BudgetContext } from "../../store/BudgetContext"

/**
 * FormModal component to display Modal with form.
 * @param {object} fields - Create form fields.
 * @param {string} objectType - Type of created object.
 * @param {boolean} open - Indicates if Form is open.
 * @param {boolean} setOpen - Changes state of open value.
 * @param {function} callApi - Function called on Form submit.
 * @param {function} setAlert - Alert setter function.
 * @param {object | undefined} updatedObject - Object being updated by form.
 * @param {array} disabledFields - Array of disabled fields.
 */
const FormModal = (
    {
        fields,
        objectType,
        open,
        setOpen,
        callApi,
        setAlert,
        updatedObject=undefined,
        disabledFields=[]
    }
) => {
    const { register, handleSubmit, reset, control } = useForm();
    const [fieldErrors, setFieldErrors] = useState({});
    const [nonFieldErrors, setNonFieldErrors] = useState(null);
    const { updateRefreshTimestamp } = useContext(BudgetContext);

    const onSubmit = async (data) => {
        setFieldErrors({});
        setNonFieldErrors(null);

        try {
            const response = await callApi(data);
            setAlert({ type: 'success', message: response.name ? `Object ${response.name} created successfully.` : 'Object created successfully.' });
            updateRefreshTimestamp()
            setOpen(false);
            reset();
        } catch (error) {
            console.log(error)
            if (error instanceof ApiError && typeof error.data === 'object') {
                let apiErrors = error.data.detail;
                let nonFieldApiErrors = [];
                let fieldApiErrors = {};
                Object.keys(apiErrors).forEach(key => {
                    if (key in fields) {
                        fieldApiErrors[key] = apiErrors[key].join(' | ');
                    } else {
                        apiErrors[key].forEach((message) => {
                            if (key === 'non_field_errors') {
                                nonFieldApiErrors.push(`${message}\n`);
                            } else {
                                nonFieldApiErrors.push(`${key}: ${message}\n`);
                            }
                        });
                    }
                });
                setFieldErrors(fieldApiErrors);
                setNonFieldErrors(nonFieldApiErrors.length ? nonFieldApiErrors : null);
            } else {
                console.error(error);
                setNonFieldErrors("Unexpected error occurred.");
            }
        }
    };

    return (
        <StyledModal open={open} onClose={() => setOpen(false)}>
            <Box
                width={400}
                bgcolor="#F1F1F1"
                p={3}
                borderRadius={5}
            >
                <Typography variant="h6" textAlign="center">
                    {objectType}
                </Typography>
                {nonFieldErrors &&
                    <Alert sx={{ marginTop: 2, marginBottom: 2, whiteSpace: 'pre-wrap' }} severity="error"
                        onClose={() => setNonFieldErrors(null)}>{nonFieldErrors}</Alert>}
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                    {Object.keys(fields).filter((fieldName) => !fields[fieldName]['prefixedValue']).map((fieldName) => (
                        fields[fieldName]['type'] === 'select' && fields[fieldName]['options'] ? (
                            <SelectFormField
                                key={fieldName}
                                control={control}
                                fieldName={fieldName}
                                fieldParams={fields[fieldName]}
                                fieldErrors={fieldErrors}
                                defaultValue={updatedObject ? updatedObject[fieldName] : undefined}
                                disabledFields={disabledFields}
                            />
                        ) : (
                            <InputFormField
                                key={fieldName}
                                register={register}
                                fieldName={fieldName}
                                fieldParams={fields[fieldName]}
                                fieldErrors={fieldErrors}
                                defaultValue={updatedObject ? updatedObject[fieldName] : undefined}
                                disabledFields={disabledFields}
                            />
                        )
                    ))}
                    <StyledButton type="submit" variant="contained" fullWidth>
                        Submit
                    </StyledButton>
                </Box>
            </Box>
        </StyledModal>
    )
}

export default FormModal;