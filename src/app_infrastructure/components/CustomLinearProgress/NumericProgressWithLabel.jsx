import { Box, Grid, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { WalletContext } from '../../store/WalletContext';
import ColouredLinearProgress from './ColouredLinearProgress';

/**
 * NumericProgressWithLabel component to display LinearProgress with numeric values (with currency or not).
 */
export const NumericProgressWithLabel = ({
  currentValue,
  maxValue,
  withCurrency = false,
}) => {
  const { contextWalletCurrency } = useContext(WalletContext);

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
            {withCurrency ? `\u00A0${contextWalletCurrency}` : ''} / {maxValue}
            {withCurrency ? `\u00A0${contextWalletCurrency}` : ''}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NumericProgressWithLabel;
