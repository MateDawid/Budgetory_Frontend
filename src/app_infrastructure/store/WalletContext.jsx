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

  /**
   * Gets context Wallet id from context or storage.
   */
  const getContextWalletId = () => {
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

  const value = {
    getContextWalletId,
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
