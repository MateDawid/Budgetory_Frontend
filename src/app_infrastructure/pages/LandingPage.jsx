import { Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import BudgetDepositsChart from '../../budgets/components/BudgetDepositsChart';

/**
 * LandingPage component displays home page of application.
 */
function LandingPage() {
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Paper
            elevation={24}
            sx={{
              padding: 2,
              bgColor: '#F1F1F1',
            }}
          >
            <Typography
              variant="h4"
              sx={{ display: 'block', color: '#BD0000' }}
            >
              Period progress bar (basing on current date)<br/>
              Expenses progress bar<br/>
              Incomes progress bar
            </Typography>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper
            elevation={24}
            sx={{
              padding: 2,
              bgColor: '#F1F1F1',
            }}
          >
            <Typography
              variant="h4"
              sx={{ display: 'block', color: '#BD0000' }}
            >
              Expenses and incomes in Periods
            </Typography>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper
            elevation={24}
            sx={{
              padding: 2,
              bgColor: '#F1F1F1',
            }}
          >
            <Typography
              variant="h4"
              sx={{ display: 'block', color: '#BD0000' }}
            >
              Deposit results in Periods
            </Typography>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper
            elevation={24}
            sx={{
              padding: 2,
              bgColor: '#F1F1F1',
            }}
          >
            <Typography
              variant="h4"
              sx={{ display: 'block', color: '#BD0000' }}
            >
              Categories and predictions results in Periods
            </Typography>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper
            elevation={24}
            sx={{
              padding: 2,
              bgColor: '#F1F1F1',
            }}
          >
            <Typography
              variant="h4"
              sx={{ display: 'block', color: '#BD0000' }}
            >
              Entity incomes/expenses in Periods
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default LandingPage;
