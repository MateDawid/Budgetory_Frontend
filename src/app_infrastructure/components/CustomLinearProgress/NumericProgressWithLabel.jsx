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
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1} height="100%" width="100%">
            <Box sx={{ width: "70%", mr: 1 }}>
                <ColouredLinearProgress currentValue={currentValue} maxValue={maxValue}/>
            </Box>
            <Box sx={{ display: "flex", width: "30%" }}>
                <Typography variant="body2">
                    {currentValue}{withCurrency ? ` ${contextBudgetCurrency}` : ""} / {maxValue}{withCurrency ? ` ${contextBudgetCurrency}` : ""}
                </Typography>
            </Box>
        </Stack>
    );
}

export default NumericProgressWithLabel