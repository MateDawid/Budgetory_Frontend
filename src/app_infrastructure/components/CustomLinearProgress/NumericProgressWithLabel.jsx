import { Box, Grid, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { BudgetContext } from '../../store/BudgetContext';
import ColouredLinearProgress from './ColouredLinearProgress';

/**
 * NumericProgressWithLabel component to display LinearProgress with numeric values (with currency or not).
 */
export const NumericProgressWithLabel = ({
  currentValue,
  maxValue,
  withCurrency = false,
}) => {
  const { contextBudgetCurrency } = useContext(BudgetContext);

  const getFontColor = () => {
    if (maxValue <= 0 && currentValue <= 0) {
      return 'rgb(0 0 0 / 87%)';
    } else if (currentValue > maxValue) {
      return '#BD0000';
    }
    return '#008000';
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <Grid container spacing={2}>
        <Grid size={5}>
          <ColouredLinearProgress
            currentValue={currentValue}
            maxValue={maxValue}
          />
        </Grid>
        <Grid size={7}>
          <Typography variant="body2" color={getFontColor()}>
            {currentValue}
            {withCurrency ? `\u00A0${contextBudgetCurrency}` : ''} / {maxValue}
            {withCurrency ? `\u00A0${contextBudgetCurrency}` : ''}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NumericProgressWithLabel;
