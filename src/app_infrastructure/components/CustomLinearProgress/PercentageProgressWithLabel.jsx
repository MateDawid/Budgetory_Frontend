import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import ColouredLinearProgress from "./ColouredLinearProgress";


/**
 * PercentageProgressWithLabel component to display LinearProgress with percentage values.
 */
export const PercentageProgressWithLabel = ({ currentValue, maxValue }) => {
    const progress = currentValue / maxValue * 100

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1} height="100%" width="100%">
            <Box sx={{ width: "70%", mr: 1 }}>
                <ColouredLinearProgress currentValue={currentValue} maxValue={maxValue}/>
            </Box>
            <Box sx={{ display: "flex", width: "30%" }}>
                <Typography variant="body2">{progress.toFixed(2)}&nbsp;%</Typography>
            </Box>
        </Stack>
    );
}

export default PercentageProgressWithLabel