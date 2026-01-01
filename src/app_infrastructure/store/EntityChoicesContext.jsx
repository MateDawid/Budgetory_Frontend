import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiObjectsList } from '../services/APIService';
import { BudgetContext } from './BudgetContext';

export const EntityChoicesContext = createContext();

/**
 * EntityChoicesProvider for storing choices fields options for EntityChoices purposes.
 */
export const EntityChoicesProvider = ({ children }) => {
  const { contextBudgetId } = useContext(BudgetContext);
  const [entityChoices, setEntityChoices] = useState([]);

  useEffect(() => {
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
    loadEntityChoices();
  }, [contextBudgetId]);

  const value = { entityChoices };

  return (
    <EntityChoicesContext.Provider value={value}>
      {children}
    </EntityChoicesContext.Provider>
  );
};
