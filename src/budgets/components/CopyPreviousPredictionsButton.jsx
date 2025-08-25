import { Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { Box } from "@mui/system";
import { useForm } from "react-hook-form";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StyledButton from "../../app_infrastructure/components/StyledButton";
import StyledModal from "../../app_infrastructure/components/StyledModal";
import { getApiResponse } from "../../app_infrastructure/services/APIService";
import { BudgetContext } from "../../app_infrastructure/store/BudgetContext";
// import { BudgetContext } from "../../app_infrastructure/store/BudgetContext";


/**
 * CopyPreviousPredictionsButton component to display Modal with warning before copying previous Period ExpensePredicitons.
 * @param {string} periodId - API ID of Period in which Predictions will be created.
 * @param {string} apiUrl - Base API url to be called POST method.
 * @param {function} setAlert - Function to set Alert.
 */
const CopyPreviousPredictionsButton = ({ periodId, apiUrl, setAlert }) => {
    const [open, setOpen] = useState(false);
    const { updateRefreshTimestamp } = useContext(BudgetContext);
    const { handleSubmit } = useForm();

    /**
     * Function calling API to copy Predictions from previous Period.
     */
    const onSubmit = async () => {
        try {
            const response = await getApiResponse(
                `${apiUrl}${periodId}/`,
                { method: "POST"}
            )
            const jsonResponse = await response.json()
            console.log(jsonResponse)
            setOpen(false)
            setAlert({ type: 'success', message: jsonResponse });
            updateRefreshTimestamp()
        } catch (error) {
            console.log(error)
            setOpen(false)
            setAlert({ type: 'error', message: error.message });
        }
    };

    return (
        <>
            <StyledButton onClick={() => setOpen(true)} variant="outlined"
                startIcon={<ContentCopyIcon />}>
                Copy from previous period
            </StyledButton>
            <StyledModal open={open} onClose={() => setOpen(false)}>
                <Box
                    width={400}
                    bgcolor="#F1F1F1"
                    p={3}
                    borderRadius={5}
                >
                    <Typography variant="h6" component="h2" textAlign="center">
                        Copying Predictions from previous Period
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                        <Typography>This action will copy Expense Predictions created in previous Period. Do you want do continue?</Typography>
                        <StyledButton type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                            Continue
                        </StyledButton>
                    </Box>
                </Box>
            </StyledModal>
        </>
    );
};

export default CopyPreviousPredictionsButton;