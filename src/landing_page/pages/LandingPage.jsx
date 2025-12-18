import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PeriodsTransfersChart from '../components/PeriodsTransfersChart';

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
            <StyledHeader variant="h5">Transfers</StyledHeader>
            <PeriodsTransfersChart />
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
            <StyledHeader variant="h5">Deposits</StyledHeader>
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
            <StyledHeader variant="h5">Categories and predictions</StyledHeader>
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
            <StyledHeader variant="h5">Entities</StyledHeader>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default LandingPage;
