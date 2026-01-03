import React from 'react';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import Divider from '@mui/material/Divider';
import PeriodDataGrid from '../components/PeriodDataGrid';

/**
 *  PeriodList component to display list of Wallet  Periods.
 */
export default function PeriodList() {
  document.title = 'Periods';

  return (
    <Paper
      elevation={24}
      sx={{
        padding: 2,
        bgColor: '#F1F1F1',
      }}
    >
      <Typography
        variant="h4"
        sx={{ display: 'block', color: '#BD0000', mb: 1 }}
      >
        Periods
      </Typography>
      <Divider />
      <PeriodDataGrid />
    </Paper>
  );
}
