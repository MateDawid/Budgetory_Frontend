import React, { createContext, useState } from 'react';

export const AlertContext = createContext();

/**
 * AlertProvider for enabling to pass alert data between pages.
 */
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const value = {
    alert,
    setAlert,
  };

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
};
