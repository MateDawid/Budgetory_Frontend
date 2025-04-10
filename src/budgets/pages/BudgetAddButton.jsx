import {
    Modal,
    styled,
    TextField,
    Typography,
} from "@mui/material";
import React, {useContext, useState} from "react";
import {
    Add as AddIcon,
} from "@mui/icons-material";
import {Box} from "@mui/system";
import StyledButton from "../../app_infrastructure/components/StyledButton";
import {useForm} from "react-hook-form";
import {createApiObject} from "../../app_infrastructure/services/APIService";
import ApiError from "../../app_infrastructure/utils/ApiError";
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import Alert from "@mui/material/Alert";

const StyledModal = styled(Modal)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});

const StyledTextField = styled(TextField)(({theme}) => ({
    variant: "outlined",
    marginBottom: theme.spacing(2),
}));


/**
 * BudgetAddButton component to display Modal with form for creating new Budget.
 * @param {function} setAddedBudgetId - BudgetList useState setter for refreshing Budget list on new Budget adding.
 */
const BudgetAddButton = ({setAddedBudgetId}) => {
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/`
    const [open, setOpen] = useState(false);
    const {register, handleSubmit} = useForm();
    const [fieldErrors, setFieldErrors] = useState({});
    const [nonFieldError, setNonFieldError] = useState(null);
    const {setAlert} = useContext(AlertContext);

    const onSubmit = async (data) => {
        setFieldErrors({})
        setNonFieldError(null)

        try {
            const createResponse = await createApiObject(apiUrl, data);
            setAddedBudgetId(createResponse.id)
            setAlert({type: 'success', message: `Budget "${data.name}" created successfully.`})
            setOpen(false)
        } catch (error) {
            if (error instanceof ApiError) {
                let errors = error.data.detail
                if (errors.hasOwnProperty('non_field_errors')) { // eslint-disable-line no-prototype-builtins
                    setNonFieldError(errors['non_field_errors'].join('\n'));
                    delete errors['non_field_errors'];
                }
                Object.keys(errors).forEach(key => {
                    console.log(errors[key])
                    errors[key] = errors[key].join(' | ')
                })
                setFieldErrors(errors);
            } else {
                console.error(error)
                setNonFieldError("Unexpected error occurred.");
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
                        Create Budget
                    </Typography>
                    {nonFieldError &&
                        <Alert sx={{marginTop: 2, marginBottom: 2, whiteSpace: 'pre-wrap'}} severity="error"
                               onClose={() => setNonFieldError(null)}>{nonFieldError}</Alert>}
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
                        <StyledTextField
                            required
                            fullWidth
                            label="Name"
                            autoFocus
                            {...register("name")}
                            error={!!fieldErrors.name}
                            helperText={fieldErrors.name ? fieldErrors.name : ''}
                        />
                        <StyledTextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            {...register("description")}
                            error={!!fieldErrors.description}
                            helperText={fieldErrors.description ? fieldErrors.description : ''}
                        />
                        <StyledTextField
                            required
                            fullWidth
                            label="Currency"
                            {...register("currency")}
                            error={!!fieldErrors.currency}
                            helperText={fieldErrors.currency ? fieldErrors.currency : ''}
                        />
                        <StyledButton type="submit" variant="contained" fullWidth>
                            Create
                        </StyledButton>
                    </Box>
                </Box>
            </StyledModal>
        </>
    );
};

export default BudgetAddButton;