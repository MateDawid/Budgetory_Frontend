import {Box, LinearProgress, Stack, Typography} from "@mui/material";
import React from "react";

// TODO: Backend part of generating data, then adjust colors here

/**
 * PercentageProgressWithLabel component to display LinearProgress with percentage values and adjustable colours.
 */
const PercentageProgressWithLabel = (props) => {
    const maxValue = 100

    /**
     * Function calculate value for LinearProgress component. In case of overflowing maxValue it will reduce displayed
     * value to show how much inputValue overflows maxValue.
     * @param {number} inputValue - Input value of displayed percentage for component.
     * @return {number} - Calculated value of displayed percentage for component.
     */
    const getBarValue = (inputValue) => {
        if (inputValue <= maxValue) {
            return inputValue;
        } else {
            return inputValue - maxValue;
        }
    }

    /**
     * Function calculate background color for LinearProgress component.
     * @param {number} inputValue - Input value of displayed percentage for component.
     * @return {string} - Calculated background colour.
     */
    const getBackgroundColor = (inputValue) => {
        if (inputValue <= maxValue) {
            return 'white';
        } else {
            return 'yellow';
        }
    }

    /**
     * Function calculate bar color for LinearProgress component.
     * @param {number} inputValue - Input value of displayed percentage for component.
     * @return {string} - Calculated background colour.
     */
    const getBarColor = (inputValue) => {
        if (inputValue <= maxValue) {
            return 'green';
        } else {
            return 'red';
        }
    }

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1} height="100%" width="100%">
            <Box sx={{width: "70%", mr: 1}}>
                <LinearProgress variant="determinate" {...props} value={getBarValue(props.value)} sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: getBackgroundColor(props.value),
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: getBarColor(props.value),
                    },
                }}/>
            </Box>
            <Box sx={{display: "flex", width: "30%"}}>
                <Typography variant="body2">{props.value} %</Typography>
            </Box>
        </Stack>
    );
}

export default PercentageProgressWithLabel