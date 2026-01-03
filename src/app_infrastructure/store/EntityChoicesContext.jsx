import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiObjectsList } from '../services/APIService';
import { WalletContext } from './WalletContext';

export const EntityChoicesContext = createContext();

/**
 * EntityChoicesProvider for storing choices fields options for EntityChoices purposes.
 */
export const EntityChoicesProvider = ({ children }) => {
  const { contextWalletId } = useContext(WalletContext);
  const [entityChoices, setEntityChoices] = useState([]);

  useEffect(() => {
    const loadEntityChoices = async () => {
      try {
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/entities/?ordering=-is_deposit,name`
        );
        setEntityChoices(response);
      } catch {
        setEntityChoices([]);
      }
    };
    if (!contextWalletId) {
      return;
    }
    loadEntityChoices();
  }, [contextWalletId]);

  const value = { entityChoices };

  return (
    <EntityChoicesContext.Provider value={value}>
      {children}
    </EntityChoicesContext.Provider>
  );
};
