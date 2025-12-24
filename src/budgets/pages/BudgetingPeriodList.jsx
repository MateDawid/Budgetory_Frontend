import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';
import { Paper, Stack } from '@mui/material';
import Divider from '@mui/material/Divider';
import { BudgetContext } from '../../app_infrastructure/store/BudgetContext';
import BudgetingPeriodDataGrid from '../components/BudgetingPeriodDataGrid/BudgetingPeriodDataGrid';

/**
 * BudgetingPeriodList component to display list of Budget BudgetingPeriods.
 */
export default function BudgetingPeriodList() {
  const { contextBudgetId } = useContext(BudgetContext);
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods/`;

  return (
    <Paper
      elevation={24}
      sx={{
        padding: 2,
        bgColor: '#F1F1F1',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        mb={1}
      >
        <Typography variant="h4" sx={{ display: 'block', color: '#BD0000' }}>
          Periods
        </Typography>
      </Stack>
      <Divider />
      <BudgetingPeriodDataGrid />
    </Paper>
  );
}
