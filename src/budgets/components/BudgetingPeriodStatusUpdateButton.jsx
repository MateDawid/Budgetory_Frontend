import {Typography} from "@mui/material";
import React, {useContext, useState} from "react";
import LockIcon from '@mui/icons-material/Lock';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {Box} from "@mui/system";
import {useForm} from "react-hook-form";
import ApiError from "../../app_infrastructure/utils/ApiError";
import {AlertContext} from "../../app_infrastructure/store/AlertContext";
import StyledButton from "../../app_infrastructure/components/StyledButton";
import StyledModal from "../../app_infrastructure/components/StyledModal";
import PeriodStatuses from "../utils/PeriodStatuses";
import onEditableFieldSave from "../../app_infrastructure/utils/onEditableFieldSave";
import { BudgetContext } from "../../app_infrastructure/store/BudgetContext";

const statusesMapping = {
    [PeriodStatuses.ACTIVE]: {
        icon: <PlayArrowIcon/>,
        label: 'Open',
        modalHeader: 'Opening Period',
        modalMessage: 'After opening Period you will not be able modify, remove it and add more Expense Predictions in it. Do you want to continue?'
    },
    [PeriodStatuses.CLOSED]: {
        icon: <LockIcon/>,
        label: 'Close',
        modalHeader: 'Closing Period',
        modalMessage: 'After closing Period you will not be able to add more Transfers in it. Do you want to continue?'
    },
}

/**
 * BudgetingPeriodCloseButton component to display Modal with warning before closing BudgetingPeriod.
 * @param {string} objectId - API ID of object to be closed.
 * @param {number} newPeriodStatus - Status of BudgetingPeriod to be set.
 * @param {string} apiUrl - Base API url to be called with PATCH method.
 * @param {string} objectName - Name of object to be closed.
 */
const BudgetingPeriodStatusUpdateButton = ({objectId, newPeriodStatus, apiUrl, objectName}) => {
    const [open, setOpen] = useState(false);
    const {handleSubmit} = useForm();
    const {setAlert} = useContext(AlertContext);
    const {setObjectChange} = useContext(BudgetContext)

    /**
     * Function calling API to close BudgetingPeriod.
     */
    const onSubmit = async () => {
        try {
            await onEditableFieldSave(objectId, 'status', newPeriodStatus, apiUrl, setObjectChange, setAlert)
        }
        catch (error) {
            if (error instanceof ApiError) {
                setAlert({type: 'error', message: error.message})
            } else {
                console.error(error)
                setAlert({type: 'error', message: `Unexpected error occurred. Period "${objectName}" was not updated.`})
            }
        }
        finally {
            setOpen(false)
        }
    };

    return (
        <>
            <StyledButton onClick={() => setOpen(true)} variant="outlined"
                          startIcon={statusesMapping[newPeriodStatus].icon}>
                {statusesMapping[newPeriodStatus].label}
            </StyledButton>
            <StyledModal open={open} onClose={() => setOpen(false)}>
                <Box
                    width={400}
                    bgcolor="#F1F1F1"
                    p={3}
                    borderRadius={5}
                >
                    <Typography variant="h6" component="h2" textAlign="center">
                        {statusesMapping[newPeriodStatus].modalHeader} - {objectName}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
                        <Typography>{statusesMapping[newPeriodStatus].modalMessage}</Typography>
                        <StyledButton type="submit" variant="contained" fullWidth sx={{mt: 2}}>
                            Continue
                        </StyledButton>
                    </Box>
                </Box>
            </StyledModal>
        </>
    );
};

export default BudgetingPeriodStatusUpdateButton;