import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiObjectsList } from '../services/APIService';
import { WalletContext } from './WalletContext';

export const DepositChoicesContext = createContext();

/**
 * DepositChoicesProvider for storing choices fields options for DepositChoices purposes.
 */
export const DepositChoicesProvider = ({ children }) => {
  const { contextWalletId } = useContext(WalletContext);
  const [depositChoices, setDepositChoices] = useState([]);

  useEffect(() => {
    const loadDepositsChoices = async () => {
      try {
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/deposits/?ordering=name&fields=value,label`
        );
        setDepositChoices(response);
      } catch {
        setDepositChoices([]);
      }
    };
    if (!contextWalletId) {
      return;
    }
    loadDepositsChoices();
  }, [contextWalletId]);

  const value = { depositChoices };

  return (
    <DepositChoicesContext.Provider value={value}>
      {children}
    </DepositChoicesContext.Provider>
  );
};
