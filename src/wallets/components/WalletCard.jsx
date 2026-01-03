import { Box, Card, CardActions, CardHeader } from '@mui/material';
import PageviewIcon from '@mui/icons-material/Pageview';
import React from 'react';
import { Link } from 'react-router-dom';
import StyledButton from '../../app_infrastructure/components/StyledButton';
import DeleteButton from '../../app_infrastructure/components/DeleteButton';

/**
 * Truncate text if it exceeds a certain length.
 */
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

/**
 * WalletCard component to display single Wallet card on Wallets list.
 */
const WalletCard = ({ wallet, apiUrl, setDeletedWalletId }) => {
  return (
    <Card variant="outlined" sx={{ marginTop: 2, borderColor: '#D0D0D0' }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <CardHeader title={truncateText(wallet.name, 18)} />
        <CardActions sx={{ width: '100%' }}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <StyledButton
              component={Link}
              to={`/wallets/${wallet.id}`}
              variant="outlined"
              startIcon={<PageviewIcon />}
            >
              View
            </StyledButton>
            <DeleteButton
              apiUrl={apiUrl}
              objectId={wallet.id}
              setDeletedObjectId={setDeletedWalletId}
              objectDisplayName="Wallet"
              rightbarWalletsRefresh
            />
          </Box>
        </CardActions>
      </Box>
    </Card>
  );
};

export default WalletCard;
