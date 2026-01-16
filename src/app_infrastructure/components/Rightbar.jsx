import * as React from 'react';
import {
  Box,
  Card,
  List,
  Divider,
  Link,
  Typography,
  ListItem,
  ListItemText,
} from '@mui/material';
import RightbarItem from './RightbarItem';
import WalletSelector from './WalletSelector';
import { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../store/WalletContext';
import { AlertContext } from '../store/AlertContext';
import { getApiObjectsList } from '../services/APIService';

/**
 * Rightbar component to display WalletSelector and Deposits balances on right side of screen
 */
const Rightbar = () => {
  const { setAlert } = useContext(AlertContext);
  const { contextWalletId, refreshTimestamp } = useContext(WalletContext);
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    const loadWalletDeposits = async () => {
      if (
        !contextWalletId ||
        ['/login', '/register'].includes(window.location.pathname)
      ) {
        setAlert(null);
        return;
      }
      try {
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/deposits/?ordering=name&fields=id,name,balance`
        );
        setDeposits(response);
      } catch (error) {
        console.error(error);
        setDeposits([]);
      }
    };
    if (!contextWalletId) {
      return;
    }
    loadWalletDeposits();
  }, [contextWalletId, refreshTimestamp]);

  return (
    <Box width={240} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
      <Box
        position="fixed"
        width={240}
        pt={2}
        display="flex"
        justifyContent="center"
      >
        <Card>
          <Box
            width={220}
            display="flex"
            flexDirection="column"
            alignItems="center"
            pt={2}
          >
            <WalletSelector />
            <Divider variant="middle" />
            <List sx={{ width: '100%' }}>
              {contextWalletId && deposits.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          display: 'block',
                          color: '#000000',
                          width: '100%',
                          textAlign: 'center',
                        }}
                      >
                        {' '}
                        Create first{' '}
                        <Link href="/deposits" underline="hover">
                          Deposit
                        </Link>{' '}
                      </Typography>
                    }
                  />
                </ListItem>
              )}
              {deposits.map((deposit) => (
                <RightbarItem key={deposit.id} deposit={deposit} />
              ))}
            </List>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Rightbar;
