import StyledModal from "./StyledModal";
import {Box} from "@mui/system";
import {Typography} from "@mui/material";
import StyledButton from "./StyledButton";
import React, {useContext} from "react";
import {useForm} from "react-hook-form";
import {deleteApiObject} from "../services/APIService";
import {useNavigate} from "react-router-dom";
import {AlertContext} from "./AlertContext";
import {BudgetContext} from "./BudgetContext";

/**
 * DeleteModal to be displayed before deleting object.
 * @param {boolean} open - Indicates if Modal is opened.
 * @param {function} setOpen - Function to set Modal opened.
 * @param {string} objectId - API ID of object to be deleted.
 * @param {string} apiUrl - Base API url to be called with DELETE method.
 * @param {string} objectDisplayName - Name of deleted object for messages display.
 * @param {string} message - Message to be displayed on Modal.
 * @param {function|null} setDeletedObjectId - useState setter for refreshing objects list on object deleting.
 * @param {string|null} redirectOnSuccess - url to which redirect on delete success.
 * @param {boolean} rightbarRefresh - Indicates if Righbar data should be refreshed after deleting an object
 */
const DeleteModal = ({open, setOpen, objectId, apiUrl, objectDisplayName, message, setDeletedObjectId = null, redirectOnSuccess = null, rightbarRefresh = false}) => {
    const navigate = useNavigate();
    const {setAlert} = useContext(AlertContext);
    const {setUpdatedContextBudget} = useContext(BudgetContext);
    const {handleSubmit} = useForm();

    /**
     * Function to perform DELETE API call.
     */
    const onSubmit = async () => {
        try {
            await deleteApiObject(apiUrl, objectId);
            setAlert({type: 'success', message: "Object deleted successfully"});
            if (setDeletedObjectId !== null) {
                setDeletedObjectId(objectId)
            }
            if (redirectOnSuccess !== null) {
                navigate(redirectOnSuccess)
            }
            if (rightbarRefresh) {
                setUpdatedContextBudget(`${objectId}_delete`)
            }
        } catch (error) {
            console.error(error)
            setAlert({type: 'error', message: error.message});
        } finally {
            setOpen(false)
        }
    };

    return <StyledModal open={open} onClose={() => setOpen(false)}>
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
                <Typography>{message}</Typography>
                <StyledButton type="submit" variant="contained" fullWidth sx={{mt: 2}}>
                    Delete
                </StyledButton>
            </Box>
        </Box>
    </StyledModal>
}

export default DeleteModal;