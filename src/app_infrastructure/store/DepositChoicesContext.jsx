import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiObjectsList } from '../services/APIService';
import { BudgetContext } from './BudgetContext';

export const DepositChoicesContext = createContext();

/**
 * DepositChoicesProvider for storing choices fields options for DepositChoices purposes.
 */
export const DepositChoicesProvider = ({ children }) => {
  const { contextBudgetId } = useContext(BudgetContext);
  const [depositChoices, setDepositChoices] = useState([]);

  useEffect(() => {
    const loadDepositsChoices = async () => {
      try {
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`
        );
        setDepositChoices(response);
      } catch {
        setDepositChoices([]);
      }
    };
    if (!contextBudgetId) {
      return;
    }
    loadDepositsChoices();
  }, [contextBudgetId]);

  const value = { depositChoices };

  return (
    <DepositChoicesContext.Provider value={value}>{children}</DepositChoicesContext.Provider>
  );
};
