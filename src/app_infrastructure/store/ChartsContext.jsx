import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiObjectsList } from '../services/APIService';
import { BudgetContext } from './BudgetContext';

export const ChartsContext = createContext();

/**
 * ChartsProvider for storing choices fields options for Charts purposes.
 */
export const ChartsProvider = ({ children }) => {
  const { contextBudgetId } = useContext(BudgetContext);
  const [periodChoices, setPeriodChoices] = useState([]);
  const [depositChoices, setDepositChoices] = useState([]);
  const [entityChoices, setEntityChoices] = useState([]);

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
    const loadEntityChoices = async () => {
      try {
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/entities/?ordering=-is_deposit,name`
        );
        setEntityChoices(response);
      } catch {
        setEntityChoices([]);
      }
    };
    if (!contextBudgetId) {
      return;
    }
    loadPeriodsChoices();
    loadDepositsChoices();
    loadEntityChoices();
  }, [contextBudgetId]);

  const value = {
    periodChoices,
    depositChoices,
    entityChoices,
  };

  return (
    <ChartsContext.Provider value={value}>{children}</ChartsContext.Provider>
  );
};
