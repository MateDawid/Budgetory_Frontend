import React, {createContext, useEffect, useState} from 'react';

export const BudgetContext = createContext();

/**
 * ContextBudgetProvider for storing context Budget between pages.
 */
export const ContextBudgetProvider = ({children}) => {
    const initialContextBudgetId = localStorage.getItem('budgetory.contextBudget')
        ? parseInt(localStorage.getItem('budgetory.contextBudget'), 10)
        : null;
    const [contextBudgetId, setContextBudgetId] = useState(initialContextBudgetId);

    /**
     * Saves contextBudgetId in localStorage on contextBudgetId change.
     */
    useEffect(() => {
        if (contextBudgetId) localStorage.setItem('budgetory.contextBudget', contextBudgetId)
    }, [contextBudgetId])

    const value = {
        contextBudgetId,
        setContextBudgetId
    };

    return (
        <BudgetContext.Provider value={value}>
            {children}
        </BudgetContext.Provider>
    );
};