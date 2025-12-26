import React from 'react';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import Divider from '@mui/material/Divider';
import BudgetingPeriodDataGrid from '../components/BudgetingPeriodDataGrid/BudgetingPeriodDataGrid';

/**
 * BudgetingPeriodList component to display list of Budget BudgetingPeriods.
 */
export default function BudgetingPeriodList() {
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
      <BudgetingPeriodDataGrid />
    </Paper>
  );
}
