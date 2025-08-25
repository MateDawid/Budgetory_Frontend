import { LinearProgress } from "@mui/material";
import React from "react";


/**
 * Component returning styled LinearProgress with color calculation depending on field values
 */
export const ColouredLinearProgress = ({ currentValue, maxValue }) => {
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
        if (maxValue <= 0.00 || progress <= 100) {
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
        if (maxValue <= 0) {
            return '#D0D0D0';
        }
        else if (progress <= 100) {
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
        <LinearProgress variant="determinate" value={getBarValue()} sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: getBackgroundColor(),
            '& .MuiLinearProgress-bar': {
                backgroundColor: getBarColor(),
            },
        }} />
    );
}

export default ColouredLinearProgress