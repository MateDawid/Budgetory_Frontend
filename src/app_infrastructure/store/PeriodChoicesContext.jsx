import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiObjectsList } from '../services/APIService';
import { WalletContext } from './WalletContext';

export const PeriodChoicesContext = createContext();

/**
 * PeriodChoicesProvider for storing choices fields options for PeriodChoices purposes.
 */
export const PeriodChoicesProvider = ({ children }) => {
  const { getContextWalletId } = useContext(WalletContext);
  const contextWalletId = getContextWalletId();
  const [periodChoices, setPeriodChoices] = useState([]);

  useEffect(() => {
    const loadPeriodsChoices = async () => {
      try {
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/periods/?ordering=-date_start&fields=value,label`
        );
        setPeriodChoices(response);
      } catch {
        setPeriodChoices([]);
      }
    };
    if (!contextWalletId) {
      return;
    }
    loadPeriodsChoices();
  }, [contextWalletId]);

  const value = { periodChoices };

  return (
    <PeriodChoicesContext.Provider value={value}>
      {children}
    </PeriodChoicesContext.Provider>
  );
};
