import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import React from "react";


/**
 * PercentageProgressWithLabel component to display LinearProgress with percentage values and adjustable colours.
 */
export const PercentageProgressWithLabel = ({ currentValue, maxValue }) => {
    const progress = currentValue / maxValue * 100

    /**
     * Function calculate value for LinearProgress component. In case of overflowing maxValue it will reduce displayed
     * value to show how much inputValue overflows maxValue.
     * @return {number} - Calculated value of displayed percentage for component.
     */
    const getBarValue = () => {
        if (progress <= 100) {
            return progress;
        } else {
            return progress - 100;
        }
    }

    /**
     * Function calculate background color for LinearProgress component.
     * @return {string} - Calculated background colour.
     */
    const getBackgroundColor = () => {
        if (progress <= 100) {
            return '#D0D0D0';
        }
        else if (progress <= 200) {
            return '#008000'
        }
        else {
            return '#BD0000';
        }
    }

    /**
     * Function calculate bar color for LinearProgress component.
     * @return {string} - Calculated background colour.
     */
    const getBarColor = () => {
        if (progress <= 100) {
            return '#008000';
        }
        else if (progress <= 200) {
            return '#BD0000'
        }
        else {
            return '#BD0000';
        }
    }

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1} height="100%" width="100%">
            <Box sx={{ width: "70%", mr: 1 }}>
                <LinearProgress variant="determinate" value={getBarValue()} sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: getBackgroundColor(),
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: getBarColor(),
                    },
                }} />
            </Box>
            <Box sx={{ display: "flex", width: "30%" }}>
                <Typography variant="body2">{progress.toFixed(2)}&nbsp;%</Typography>
            </Box>
        </Stack>
    );
}

export default PercentageProgressWithLabel