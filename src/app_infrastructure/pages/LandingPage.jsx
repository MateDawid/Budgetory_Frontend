import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import DepositsInPeriodsChart from '../../charts/components/DepositsInPeriodsChart';
import TransfersInPeriodsChart from '../../charts/components/TransfersInPeriodsChart';
import CategoriesInPeriodsChart from '../../charts/components/CategoriesInPeriodsChart';
import TopEntitiesInPeriodChart from '../../charts/components/TopEntitiesInPeriodChart';

const StyledHeader = styled(Typography)(() => ({
  display: 'block',
  color: '#BD0000',
  width: '100%',
  textAlign: 'center',
  marginBottom: '14px',
}));

/**
 * LandingPage component displays home page of application.
 */
function LandingPage() {
  document.title = 'Budgetory';

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Paper
            elevation={24}
            sx={{
              padding: 2,
              bgColor: '#F1F1F1',
            }}
          >
            <StyledHeader variant="h5">Transfers in Periods</StyledHeader>
            <TransfersInPeriodsChart />
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
            <StyledHeader variant="h5">Deposits in Periods</StyledHeader>
            <DepositsInPeriodsChart />
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
            <StyledHeader variant="h5">Categories in Periods</StyledHeader>
            <CategoriesInPeriodsChart />
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
            <StyledHeader variant="h5">Entities in Periods</StyledHeader>
            <TopEntitiesInPeriodChart />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default LandingPage;
