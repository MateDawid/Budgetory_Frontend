import {Typography} from "@mui/material";
import React, {useContext, useState} from "react";
import LockIcon from '@mui/icons-material/Lock';
import {Box} from "@mui/system";
import {useForm} from "react-hook-form";
import {updateApiObject} from "../../app_infrastructure/services/APIService";
import ApiError from "../../app_infrastructure/utils/ApiError";
import PeriodStatuses from "../utils/PeriodStatuses";
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import StyledButton from "../../app_infrastructure/components/StyledButton";
import StyledModal from "../../app_infrastructure/components/StyledModal";


/**
 * BudgetingPeriodCloseButton component to display Modal with warning before closing BudgetingPeriod.
 * @param {string} objectId - API ID of object to be closed.
 * @param {string} objectName - Name of object to be closed.
 * @param {string} apiUrl - Base API url to be called with PATCH method.
 * @param {function|null} setUpdatedObjectId - useState setter for refreshing objects list on object update.
 */
const BudgetingPeriodCloseButton = ({objectId, objectName, apiUrl, setUpdatedObjectId}) => {
    const [open, setOpen] = useState(false);
    const {handleSubmit} = useForm();
    const {setAlert} = useContext(AlertContext);

    /**
     * Function calling API to close BudgetingPeriod.
     */
    const onSubmit = async () => {
        let payload = {id: objectId, status: PeriodStatuses.CLOSED}
        try {
            const response = await updateApiObject(apiUrl, payload);
            if (!response.ok) {
                const apiErrors = response.data.detail
                let errorMessageParts = []
                Object.keys(apiErrors).forEach(key => {
                    apiErrors[key].forEach((message) => {
                        if (key === 'non_field_errors') {
                            errorMessageParts.push(message)
                        } else {
                            errorMessageParts.push(`${key}: ${message}`)
                        }
                    });
                })
                throw new ApiError(errorMessageParts.join('\n'));
            }
            setUpdatedObjectId(objectId)
            setAlert({type: 'success', message: `Period "${objectName}" closed successfully.`})
        } catch (error) {
            if (error instanceof ApiError) {
                setAlert({type: 'error', message: error.message})
            } else {
                console.error(error)
                setAlert({type: 'error', message: `Unexpected error occurred. Period "${objectName}" was not closed.`})
            }
        } finally {
            setOpen(false)
        }
    };

    return (
        <>
            <StyledButton onClick={() => setOpen(true)} variant="outlined" startIcon={<LockIcon/>}>
                Close
            </StyledButton>
            <StyledModal open={open} onClose={() => setOpen(false)}>
                <Box
                    width={400}
                    bgcolor="#F1F1F1"
                    p={3}
                    borderRadius={5}
                >
                    <Typography variant="h6" component="h2" textAlign="center">
                        Closing Period
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
                        <Typography>
                            After closing Period &quot;{objectName}&quot; you will not be able to add more Transfers in it. Do you want to
                            continue?
                        </Typography>
                        <StyledButton type="submit" variant="contained" fullWidth sx={{mt: 2}}>
                            Continue
                        </StyledButton>
                    </Box>
                </Box>
            </StyledModal>
        </>
    );
};

export default BudgetingPeriodCloseButton;