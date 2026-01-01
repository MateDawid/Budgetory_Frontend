import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiObjectsList } from '../services/APIService';
import { BudgetContext } from './BudgetContext';

export const PeriodChoicesContext = createContext();

/**
 * PeriodChoicesProvider for storing choices fields options for PeriodChoices purposes.
 */
export const PeriodChoicesProvider = ({ children }) => {
  const { contextBudgetId } = useContext(BudgetContext);
  const [periodChoices, setPeriodChoices] = useState([]);

  useEffect(() => {
    const loadPeriodsChoices = async () => {
      try {
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods/`
        );
        setPeriodChoices(response);
      } catch {
        setPeriodChoices([]);
      }
    };
    if (!contextBudgetId) {
      return;
    }
    loadPeriodsChoices();
  }, [contextBudgetId]);

  const value = { periodChoices };

  return (
    <PeriodChoicesContext.Provider value={value}>{children}</PeriodChoicesContext.Provider>
  );
};
