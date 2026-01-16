import React, { useState, useEffect, useContext } from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { WalletContext } from '../store/WalletContext';
import { getApiObjectsList } from '../services/APIService';

/**
 * WalletSelector component to display Wallet select field for used by DataGrid to obtain Wallet data.
 */
const WalletSelector = () => {
  const {
    contextWalletId,
    setContextWalletId,
    setContextWalletCurrency,
    refreshTimestamp,
  } = useContext(WalletContext);
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState('');

  useEffect(() => {}, []);

  /**
   * Fetches Wallets to be selected in Select component from API and tries to get contextWallet from fetched Wallets.
   */
  useEffect(() => {
    const loadContextWallet = () => {
      if (contextWalletId) {
        return contextWalletId;
      }
      const storageContextWalletId = localStorage.getItem(
        'budgetory.contextWallet'
      )
        ? parseInt(localStorage.getItem('budgetory.contextWallet'), 10)
        : null;
      const storageContextWalletCurrency =
        localStorage.getItem('budgetory.contextWalletCurrency') || '';
      setContextWalletId(storageContextWalletId);
      setContextWalletCurrency(storageContextWalletCurrency);
      return storageContextWalletId;
    };
    const loadWallets = async () => {
      try {
        const loadedWalletId = loadContextWallet();
        const apiResponse = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/wallets/?fields=id,name,currency_name`
        );
        setWallets(apiResponse);
        if (apiResponse.length < 1) {
          localStorage.removeItem('budgetory.contextWallet');
          localStorage.removeItem('budgetory.contextWalletCurrency');
          return;
        }
        const contextWallet = apiResponse.find(
          (wallet) => wallet.id === loadedWalletId
        );
        if (contextWallet) {
          setSelectedWallet(contextWallet);
          setContextWalletCurrency(contextWallet.currency_name);
        } else {
          setSelectedWallet(apiResponse[0]);
          setContextWalletId(apiResponse[0].id);
          localStorage.setItem('budgetory.contextWallet', apiResponse[0].id);
          localStorage.setItem(
            'budgetory.contextWalletCurrency',
            apiResponse[0].currency_name
          );
        }
      } catch {
        setWallets([]);
        localStorage.removeItem('budgetory.contextWallet');
        localStorage.removeItem('budgetory.contextWalletCurrency');
      }
    };
    loadWallets();
  }, [refreshTimestamp]);

  /**
   * Function to handle selecting new Wallet in Select component.
   * Updates WalletSelector state selectedWallet and updates localStorage with selected Wallet id.
   * @param {PointerEvent} event - event on selecting Wallet from Select component.
   */
  const handleChange = (event) => {
    setSelectedWallet(
      wallets.find((wallet) => wallet.id === event.target.value.id)
    );
    setContextWalletId(event.target.value.id);
    setContextWalletCurrency(event.target.value.currency_name);
    localStorage.setItem('budgetory.contextWallet', event.target.value.id);
    localStorage.setItem(
      'budgetory.contextWalletCurrency',
      event.target.value.currency_name
    );
    localStorage.removeItem('budgetory.periodFilter');
  };

  return (
    <FormControl sx={{ width: '90%' }}>
      <InputLabel sx={{ fontWeight: 700 }}>Wallet</InputLabel>
      <Select
        value={selectedWallet}
        onChange={handleChange}
        label="Wallet"
        sx={{ width: '100%' }}
      >
        {wallets.map((wallet) => (
          <MenuItem key={wallet.id} value={wallet}>
            {wallet.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default WalletSelector;
