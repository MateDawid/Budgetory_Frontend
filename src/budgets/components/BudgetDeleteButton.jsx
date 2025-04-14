import {Typography} from "@mui/material";
import React, {useContext, useState} from "react";
import {
    Delete as DeleteIcon,
} from "@mui/icons-material";
import {Box} from "@mui/system";
import StyledButton from "../../app_infrastructure/components/StyledButton";
import {useForm} from "react-hook-form";
import {deleteApiObject} from "../../app_infrastructure/services/APIService";
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import StyledModal from "../../app_infrastructure/components/StyledModal";
import {useNavigate} from "react-router-dom";


/**
 * BudgetDeleteButton component to display Modal with warning before deleting Budget.
 * @param {string} budgetId - ID of Budget to be deleted.
 * @param {function|null} setDeletedBudgetId - BudgetList useState setter for refreshing Budget list on Budget deleting.
 * @param {string|null} redirectOnSuccess - url to which redirect on delete success.
 */
const BudgetDeleteButton = ({budgetId, setDeletedBudgetId = null, redirectOnSuccess = null}) => {
    const navigate = useNavigate();
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/`
    const [open, setOpen] = useState(false);
    const {handleSubmit} = useForm();
    const {setAlert} = useContext(AlertContext);

    /**
     * Function to perform DELETE API call.
     */
    const onSubmit = async () => {
        try {
            const deleteResponse = await deleteApiObject(apiUrl, budgetId);
            if (deleteResponse.errorOccurred) {
                setAlert({
                    type: 'error',
                    message: `Budget was not deleted because of an error: ${deleteResponse.detail}`
                });
            } else {
                setAlert({type: 'success', message: "Budget deleted successfully"});
                if (setDeletedBudgetId !== null) {
                    setDeletedBudgetId(budgetId)
                }
                if (redirectOnSuccess !== null) {
                    navigate(redirectOnSuccess)
                }
            }
        } catch (err) {
            setAlert({type: 'error', message: "Failed to delete Budget."});
        } finally {
            setOpen(false)
        }
    };

    return (
        <>
            <StyledButton onClick={() => setOpen(true)} variant="outlined" startIcon={<DeleteIcon/>}>
                Delete
            </StyledButton>
            <StyledModal open={open} onClose={() => setOpen(false)}>
                <Box
                    width={400}
                    bgcolor="#F1F1F1"
                    p={3}
                    borderRadius={5}
                >
                    <Typography variant="h6" component="h2" textAlign="center">
                        Create Budget
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
                        <Typography>
                            Deleting Budget will cause removing all related objects. Do you want to continue?
                        </Typography>
                        <StyledButton type="submit" variant="contained" fullWidth sx={{mt: 2}}>
                            Delete
                        </StyledButton>
                    </Box>
                </Box>
            </StyledModal>
        </>
    );
};

export default BudgetDeleteButton;