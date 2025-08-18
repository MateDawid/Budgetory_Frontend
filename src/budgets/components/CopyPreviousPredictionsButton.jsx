import { Typography } from "@mui/material";
import React, { useState } from "react";
import { Box } from "@mui/system";
import { useForm } from "react-hook-form";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StyledButton from "../../app_infrastructure/components/StyledButton";
import StyledModal from "../../app_infrastructure/components/StyledModal";
// import { BudgetContext } from "../../app_infrastructure/store/BudgetContext";


/**
 * CopyPreviousPredictionsButton component to display Modal with warning before copying previous Period ExpensePredicitons.
 * @param {string} periodId - API ID of Period in which Predictions will be created.
 * @param {string} apiUrl - Base API url to be called POST method.
 */

const CopyPreviousPredictionsButton = ({ periodId, apiUrl }) => {
    const [open, setOpen] = useState(false);
    const { handleSubmit } = useForm();
    // const {setObjectChange} = useContext(BudgetContext)

    /**
     * Function calling API to copy Predictions from previous Period.
     */
    const onSubmit = async () => {
        const url = `${apiUrl}${periodId}`
        console.log(url)
        // const requestOptions = {
        //     method: "POST",
        // }
        // const response = await getApiResponse(url, requestOptions)
        // const jsonResponse = response.json()
        // console.log(jsonResponse)
        // setObjectChange({ operation: 'update', objectId: periodId, objectType: apiUrl, value: value})
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