import React, {createContext, useEffect, useState} from 'react';

export const BudgetContext = createContext();

/**
 * ContextBudgetProvider for storing context Budget between pages.
 */
export const ContextBudgetProvider = ({children}) => {
    const initialContextBudgetId = localStorage.getItem('budgetory.contextBudget')
        ? parseInt(localStorage.getItem('budgetory.contextBudget'), 10)
        : null;
    const initialContextBudgetCurrency = localStorage.getItem('budgetory.contextBudgetCurrency') || ''
    const [contextBudgetId, setContextBudgetId] = useState(initialContextBudgetId);
    const [contextBudgetCurrency, setContextBudgetCurrency] = useState(initialContextBudgetCurrency);

    /**
     * Saves contextBudgetId in localStorage on contextBudgetId change.
     */
    useEffect(() => {
        if (contextBudgetId) {
            localStorage.setItem('budgetory.contextBudget', contextBudgetId)
            localStorage.setItem('budgetory.contextBudgetCurrency', contextBudgetCurrency)
        }
    }, [contextBudgetId])

    const value = {
        contextBudgetId,
        setContextBudgetId,
        contextBudgetCurrency,
        setContextBudgetCurrency
    };

    return (
        <BudgetContext.Provider value={value}>
            {children}
        </BudgetContext.Provider>
    );
};