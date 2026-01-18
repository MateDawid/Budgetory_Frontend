import React from 'react';
import Typography from '@mui/material/Typography';
import { Paper, Stack } from '@mui/material';
import Divider from '@mui/material/Divider';
import WalletDataGrid from '../components/WalletDataGrid';

/**
 * IncomeList component to display list of Wallet INCOME Transfers.
 */
export default function WalletList() {
  document.title = 'Wallets';

  return (
    <>
      <Paper elevation={24} sx={{ padding: 2, bgColor: '#F1F1F1' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          mb={1}
        >
          <Typography variant="h4" sx={{ display: 'block', color: '#BD0000' }}>
            Wallets
          </Typography>
        </Stack>
        <Divider sx={{ marginBottom: 1 }} />
        <WalletDataGrid />
      </Paper>
    </>
  );
}
