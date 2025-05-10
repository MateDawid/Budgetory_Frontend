import StyledModal from "./StyledModal";
import {Box} from "@mui/system";
import {Typography} from "@mui/material";
import StyledButton from "./StyledButton";
import React, {useContext} from "react";
import {useForm} from "react-hook-form";
import {deleteApiObject} from "../services/APIService";
import {useNavigate} from "react-router-dom";
import {AlertContext} from "./AlertContext";

const DeleteModal = ({open, setOpen, objectId, apiUrl, objectDisplayName, setDeletedObjectId = null, redirectOnSuccess = null}) => {
    const navigate = useNavigate();
    const {setAlert} = useContext(AlertContext);
    const {handleSubmit} = useForm();

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
                <Typography>
                    Deleting {objectDisplayName} will cause removing all related objects. Do you want to continue?
                </Typography>
                <StyledButton type="submit" variant="contained" fullWidth sx={{mt: 2}}>
                    Delete
                </StyledButton>
            </Box>
        </Box>
    </StyledModal>
}

export default DeleteModal;