import {Typography} from "@mui/material";
import React, {useContext, useState} from "react";
import {
    Delete as DeleteIcon,
} from "@mui/icons-material";
import {Box} from "@mui/system";
import StyledButton from "./StyledButton";
import {useForm} from "react-hook-form";
import {deleteApiObject} from "../services/APIService";
import {AlertContext} from "./AlertContext";
import StyledModal from "./StyledModal";
import {useNavigate} from "react-router-dom";


/**
 * BudgetDeleteButton component to display Modal with warning before deleting Budget.
 * @param {string} objectId - API ID of object to be deleted.
 * @param {string} apiUrl - Base API url to be called with DELETE method.
 * @param {string} objectDisplayName - Name of deleted object for messages display.
 * @param {function|null} setDeletedObjectId - useState setter for refreshing objects list on object deleting.
 * @param {string|null} redirectOnSuccess - url to which redirect on delete success.
 */
const DeleteButton = ({objectId, apiUrl, objectDisplayName, setDeletedObjectId = null, redirectOnSuccess = null}) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const {handleSubmit} = useForm();
    const {setAlert} = useContext(AlertContext);

    /**
     * Function to perform DELETE API call.
     */
    const onSubmit = async () => {
        try {
            const deleteResponse = await deleteApiObject(apiUrl, objectId);
            if (deleteResponse.errorOccurred) {
                setAlert({
                    type: 'error',
                    message: `${objectDisplayName} was not deleted because of an error: ${deleteResponse.detail}`
                });
            } else {
                setAlert({type: 'success', message: `${objectDisplayName} deleted successfully`});
                if (setDeletedObjectId !== null) {
                    setDeletedObjectId(objectId)
                }
                if (redirectOnSuccess !== null) {
                    navigate(redirectOnSuccess)
                }
            }
        } catch (err) {
            setAlert({type: 'error', message: `Failed to delete ${objectDisplayName}.`});
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
                        Delete {objectDisplayName}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
                        <Typography>
                            Deleting {objectDisplayName} will cause removing all related objects. Do you want to continue?
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

export default DeleteButton;