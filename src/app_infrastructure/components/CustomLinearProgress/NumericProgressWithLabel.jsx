import { Box, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import { BudgetContext } from "../../store/BudgetContext";
import ColouredLinearProgress from "./ColouredLinearProgress";


/**
 * NumericProgressWithLabel component to display LinearProgress with numeric values (with currency or not).
 */
export const NumericProgressWithLabel = ({ currentValue, maxValue, withCurrency = false }) => {
    const { contextBudgetCurrency } = useContext(BudgetContext);

    return (
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={1} height="100%" width="100%">
            <Box sx={{ width: "44%" }}>
                <ColouredLinearProgress currentValue={currentValue} maxValue={maxValue}/>
            </Box>
            <Box sx={{ display: "flex", maxWidth: "56%", justifyContent: "flex-end" }}>
                <Typography variant="body2">
                    {currentValue}{withCurrency ? `\u00A0${contextBudgetCurrency}` : ""} / {maxValue}{withCurrency ? `\u00A0${contextBudgetCurrency}` : ""}
                </Typography>
            </Box>
        </Stack>
    );
}

export default NumericProgressWithLabel