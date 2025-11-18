import React, { createContext, useState } from 'react';

export const BudgetContext = createContext();

/**
 * ContextBudgetProvider for storing context Budget between pages.
 */
export const ContextBudgetProvider = ({ children }) => {
  const [contextBudgetId, setContextBudgetId] = useState(null);
  const [contextBudgetCurrency, setContextBudgetCurrency] = useState(null);
  const [refreshTimestamp, setRefreshTimestamp] = useState(null); // TODO: Verify usage

  /**
   * Updates refreshTimestampt to current time.
   */
  const updateRefreshTimestamp = () => {
    setRefreshTimestamp(Date.now());
  };

  const value = {
    contextBudgetId,
    setContextBudgetId,
    contextBudgetCurrency,
    setContextBudgetCurrency,
    refreshTimestamp,
    updateRefreshTimestamp,
  };

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  );
};
