import {Typography, MenuItem} from "@mui/material";
import React, {useContext, useState} from "react";
import {Add as AddIcon} from "@mui/icons-material";
import {Box} from "@mui/system";
import StyledButton from "./StyledButton";
import {useForm} from "react-hook-form";
import {createApiObject} from "../services/APIService";
import ApiError from "../utils/ApiError";
import {AlertContext} from "./AlertContext";
import Alert from "@mui/material/Alert";
import StyledModal from "./StyledModal";
import StyledTextField from "./StyledTextField";

/**
 * CreateButton component to display Modal with form for creating new object.
 * @param {string} objectName - Object name to be displayed.
 * @param {object} fields - Create form fields.
 * @param {string} apiUrl - Base API url to be called with DELETE method.
 * @param {function} setAddedObjectId - useState setter for refreshing objects list on object adding.
 */
const CreateButton = ({objectName, fields, apiUrl, setAddedObjectId}) => {
    const [open, setOpen] = useState(false);
    const {register, handleSubmit, reset} = useForm();
    const [fieldErrors, setFieldErrors] = useState({});
    const [nonFieldErrors, setNonFieldErrors] = useState(null);
    const {setAlert} = useContext(AlertContext);

    const onSubmit = async (data) => {
        setFieldErrors({});
        setNonFieldErrors(null);

        try {
            const createResponse = await createApiObject(apiUrl, data);
            setAddedObjectId(createResponse.id);
            setAlert({type: 'success', message: `${objectName} "${data.name}" created successfully.`});
            setOpen(false);
            reset();
        } catch (error) {
            if (error instanceof ApiError) {
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
        <>
            <StyledButton onClick={() => setOpen(true)} variant="outlined" startIcon={<AddIcon/>}>
                Add
            </StyledButton>
            <StyledModal open={open} onClose={() => setOpen(false)}>
                <Box
                    width={400}
                    bgcolor="#F1F1F1"
                    p={3}
                    borderRadius={5}
                >
                    <Typography variant="h6" textAlign="center">
                        Create {objectName}
                    </Typography>
                    {nonFieldErrors &&
                        <Alert sx={{marginTop: 2, marginBottom: 2, whiteSpace: 'pre-wrap'}} severity="error"
                               onClose={() => setNonFieldErrors(null)}>{nonFieldErrors}</Alert>}
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
                        {Object.keys(fields).map((fieldName) => (
                            fields[fieldName]['type'] === 'select' ? (
                                <StyledTextField
                                    key={fieldName}
                                    {...fields[fieldName]}
                                    {...register(fieldName)}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                    }}
                                    inputProps={fields[fieldName]['type'] === 'date' ? {max: '9999-12-31'} : {}}
                                    fullWidth
                                    error={!!fieldErrors[fieldName]}
                                    helperText={fieldErrors[fieldName] ? fieldErrors[fieldName] : ''}
                                    sx={{mb: 2}}
                                >
                                    {fields[fieldName]['options'].map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </StyledTextField>
                            ) : (
                            <StyledTextField
                                key={fieldName}
                                {...fields[fieldName]}
                                {...register(fieldName)}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                                inputProps={fields[fieldName]['type'] === 'date' ? {max: '9999-12-31'} : {}}
                                fullWidth
                                error={!!fieldErrors[fieldName]}
                                helperText={fieldErrors[fieldName] ? fieldErrors[fieldName] : ''}
                                sx={{mb: 2}}
                            />
                            )
                        ))}
                        <StyledButton type="submit" variant="contained" fullWidth>
                            Create
                        </StyledButton>
                    </Box>
                </Box>
            </StyledModal>
        </>
    );
};

export default CreateButton;
