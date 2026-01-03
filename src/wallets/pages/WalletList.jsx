import React, { useContext, useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import { Typography, Paper, Box, Stack } from '@mui/material';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import WalletCard from '../components/WalletCard';
import CreateButton from '../../app_infrastructure/components/CreateButton';
import { WalletContext } from '../../app_infrastructure/store/WalletContext';

/**
 * WalletList component to display list of User Wallets.
 */
export default function WalletList() {
  document.title = 'Wallets';
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/wallets/`;
  const { refreshTimestamp } = useContext(WalletContext);
  const { setAlert } = useContext(AlertContext);
  const [deletedWalletId, setDeletedWalletId] = useState(null);
  const [wallets, setWallets] = useState([]);
  const createFields = {
    name: {
      type: 'string',
      label: 'Name',
      autoFocus: true,
      required: true,
    },
    description: {
      type: 'string',
      label: 'Description',
      multiline: true,
      rows: 4,
    },
    currency: {
      type: 'string',
      label: 'Currency',
      required: true,
    },
  };

  /**
   * Fetches Wallets list from API.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const walletsResponse = await getApiObjectsList(apiUrl);
        setWallets(walletsResponse);
      } catch {
        setAlert({ type: 'error', message: 'Failed to load Wallets.' });
      }
    };
    loadData();
  }, [refreshTimestamp, deletedWalletId]);

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
          Wallets
        </Typography>
        <CreateButton
          fields={createFields}
          apiUrl={apiUrl}
          objectType={'Wallet'}
        />
      </Stack>
      <Divider />
      <Box
        sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}
      >
        {wallets.map((wallet) => (
          <Box key={wallet.id} sx={{ width: 300, m: 1 }}>
            <WalletCard
              wallet={wallet}
              apiUrl={apiUrl}
              setDeletedWalletId={setDeletedWalletId}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
