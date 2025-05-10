import React, {useState} from "react";
import {
    Delete as DeleteIcon,
} from "@mui/icons-material";
import StyledButton from "./StyledButton";
import DeleteModal from "./DeleteModal";


/**
 * DeleteButton component to display Modal with warning before deleting object.
 * @param {string} objectId - API ID of object to be deleted.
 * @param {string} apiUrl - Base API url to be called with DELETE method.
 * @param {string} objectDisplayName - Name of deleted object for messages display.
 * @param {function|null} setDeletedObjectId - useState setter for refreshing objects list on object deleting.
 * @param {string|null} redirectOnSuccess - url to which redirect on delete success.
 * @param {boolean|null} isDisabled - disables Delete button.
 */
const DeleteButton = ({objectId, apiUrl, objectDisplayName, setDeletedObjectId = null, redirectOnSuccess = null, isDisabled = null}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <StyledButton onClick={() => setOpen(true)} variant="outlined" startIcon={<DeleteIcon/>} disabled={isDisabled}>
                Delete
            </StyledButton>
            <DeleteModal
                open={open}
                setOpen={setOpen}
                objectId={objectId}
                apiUrl={apiUrl}
                setDeletedObjectId={setDeletedObjectId}
                objectDisplayName={objectDisplayName}
                message={`Deleting ${objectDisplayName} will cause removing all related objects. Do you want to continue?`}
                redirectOnSuccess={redirectOnSuccess}
            />
        </>
    );
};

export default DeleteButton;