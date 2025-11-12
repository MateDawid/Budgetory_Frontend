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

const FormModal = (
    {
        fields,
        objectType,
        open,
        setOpen,
        callApi,
        setAlert = undefined,
        updatedObject = undefined,
    }
) => {
    const { register, handleSubmit, reset, control, setValue } = useForm();
    const [fieldErrors, setFieldErrors] = useState({});
    const [nonFieldErrors, setNonFieldErrors] = useState(null);
    const { updateRefreshTimestamp } = useContext(BudgetContext);

    const onSubmit = async (data) => {
        setFieldErrors({});
        setNonFieldErrors(null);

        try {
            await callApi(data);
            if (setAlert) {
                setAlert({ type: 'success', message: 'Object created successfully.' });
                updateRefreshTimestamp()
            }
            setOpen(false);
            reset();
        } catch (error) {
            if (error instanceof ApiError && typeof error.data === 'object') {
                let apiErrors = error.data.detail;
                let nonFieldApiErrors = [];
                let fieldApiErrors = {};
                Object.keys(apiErrors).forEach(key => {
                    if (key in fields) {
                        fieldApiErrors[key] = apiErrors[key].join(' | ');
                    } else {
                        apiErrors[key].forEach((message) => {
                            nonFieldApiErrors.push(`${message}\n`);
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
        <StyledModal open={open} onClose={() => {setOpen(false); reset();}}>
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
                                setValue={setValue}
                                fieldName={fieldName}
                                fieldParams={fields[fieldName]}
                                fieldErrors={fieldErrors}
                                defaultValue={updatedObject ? updatedObject[fieldName] : undefined}
                                {...fields[fieldName]}
                            />
                        ) : (
                            <InputFormField
                                key={fieldName}
                                register={register}
                                fieldName={fieldName}
                                fieldParams={fields[fieldName]}
                                fieldErrors={fieldErrors}
                                defaultValue={updatedObject ? updatedObject[fieldName] : undefined}
                                {...fields[fieldName]}
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