import React, { createContext, useState } from 'react';

export const WalletContext = createContext();

/**
 * ContextWalletProvider for storing context Wallet between pages.
 */
export const ContextWalletProvider = ({ children }) => {
  const [contextWalletId, setContextWalletId] = useState(null);
  const [contextWalletCurrency, setContextWalletCurrency] = useState(null);
  const [refreshTimestamp, setRefreshTimestamp] = useState(null);

  /**
   * Updates refreshTimestampt to current time.
   */
  const updateRefreshTimestamp = () => {
    setRefreshTimestamp(Date.now());
  };

  const value = {
    contextWalletId,
    setContextWalletId,
    contextWalletCurrency,
    setContextWalletCurrency,
    refreshTimestamp,
    updateRefreshTimestamp,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
