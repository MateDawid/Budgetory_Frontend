import {Typography, Autocomplete} from "@mui/material";
import React, {useContext, useState} from "react";
import {Add as AddIcon} from "@mui/icons-material";
import {Box} from "@mui/system";
import StyledButton from "./StyledButton";
import {useForm, Controller} from "react-hook-form";
import {createApiObject} from "../services/APIService";
import ApiError from "../utils/ApiError";
import {AlertContext} from "./AlertContext";
import Alert from "@mui/material/Alert";
import StyledModal from "./StyledModal";
import StyledTextField from "./StyledTextField";
import {BudgetContext} from "./BudgetContext";

/**
 * CreateButton component to display Modal with form for creating new object.
 * @param {object} fields - Create form fields.
 * @param {string} apiUrl - Base API url to be called with POST method.
 * @param {function} setAddedObjectId - useState setter for refreshing objects list on object adding.
 * @param {boolean} rightbarBudgetsRefresh - Indicates if Rightbar Budgets should be refreshed after deleting an object
 * @param {boolean} rightbarDepositsRefresh - Indicates if Rightbar Budgets should be refreshed after deleting an object
 */
const CreateButton = ({fields, apiUrl, setAddedObjectId, rightbarBudgetsRefresh = false, rightbarDepositsRefresh = false}) => {
    const [open, setOpen] = useState(false);
    const {register, handleSubmit, reset, control} = useForm();
    const [fieldErrors, setFieldErrors] = useState({});
    const [nonFieldErrors, setNonFieldErrors] = useState(null);
    const {setAlert} = useContext(AlertContext);
    const {setUpdatedContextBudget, setUpdatedContextBudgetDeposit} = useContext(BudgetContext);

    const onSubmit = async (data) => {
        setFieldErrors({});
        setNonFieldErrors(null);

        try {
            const createResponse = await createApiObject(apiUrl, data);
            setAddedObjectId(createResponse.id);
            setAlert({type: 'success', message: `Object "${data.name}" created successfully.`});
            setOpen(false);
            reset();
            if (rightbarBudgetsRefresh) {
                setUpdatedContextBudget(`${createResponse.id}_create`)
            }
            if (rightbarDepositsRefresh) {
                setUpdatedContextBudgetDeposit(`${createResponse.id}_create`)
            }
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
                        Create
                    </Typography>
                    {nonFieldErrors &&
                        <Alert sx={{marginTop: 2, marginBottom: 2, whiteSpace: 'pre-wrap'}} severity="error"
                               onClose={() => setNonFieldErrors(null)}>{nonFieldErrors}</Alert>}
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
                        {Object.keys(fields).map((fieldName) => (
                            fields[fieldName]['type'] === 'select' && fields[fieldName]['options'] ? (
                                <Controller
                                    key={fieldName}
                                    name={fieldName}
                                    control={control}
                                    defaultValue=""
                                    render={({field}) => (
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
                                                    }}
                                                    sx={{mb: 2}}
                                                />
                                            )}
                                        />
                                    )}
                                />
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