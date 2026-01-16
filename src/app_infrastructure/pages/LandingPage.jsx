import React, { useEffect, useState } from 'react';
import { CircularProgress, Grid, Link, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import DepositsInPeriodsChart from '../../charts/components/DepositsInPeriodsChart';
import TransfersInPeriodsChart from '../../charts/components/TransfersInPeriodsChart';
import CategoriesInPeriodsChart from '../../charts/components/CategoriesInPeriodsChart';
import TopEntitiesInPeriodChart from '../../charts/components/TopEntitiesInPeriodChart';
import WalletsSummaryTable from '../components/WalletsSummaryTable';
import { getApiObjectsList } from '../services/APIService';

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
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState([]);

  /**
   * Fetches Wallets from API.
   */
  useEffect(() => {
    async function getWallets() {
      const response = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/wallets/?ordering=name&fields=id,name,deposits_count,balance,currency_name`
      );
      setWallets(response);
      setLoading(false);
    }
    getWallets();
  }, []);

  return (
    <Grid container spacing={2}>
      {loading && (
        <Grid size={12} display="flex" justifyContent="center" width="100%">
          <CircularProgress size="3rem" />
        </Grid>
      )}
      {(!loading && wallets.length) === 0 && (
        <Grid size={12} display="flex" justifyContent="center" width="100%">
          <Paper
            elevation={24}
            sx={{
              padding: 2,
              bgColor: '#F1F1F1',
              width: '60%',
              alignSelf: 'center',
            }}
          >
            <StyledHeader variant="h4">
              Welcome to <b>Budgetory</b>
            </StyledHeader>
            <StyledHeader
              variant="h5"
              sx={{ color: '#000000', marginBottom: 0 }}
            >
              Create first{' '}
              <Link href="/wallets" underline="hover">
                Wallet
              </Link>{' '}
              to continue.
            </StyledHeader>
          </Paper>
        </Grid>
      )}
      {!loading && wallets.length > 0 && (
        <>
          <Grid size={12}>
            <WalletsSummaryTable wallets={wallets} />
          </Grid>
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
        </>
      )}
    </Grid>
  );
}

export default LandingPage;
