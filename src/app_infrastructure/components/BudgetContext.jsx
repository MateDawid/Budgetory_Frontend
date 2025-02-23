import React, {createContext, useEffect, useState} from 'react';

export const BudgetContext = createContext();

/**
 * ContextBudgetProvider for storing context Budget between pages.
 */
export const ContextBudgetProvider = ({children}) => {
    const [contextBudgetId, setContextBudgetId] = useState(null);

    /**
     * Gets contextBudget from localStorage.
     */
    useEffect(() => {
        const storedContextBudgetId = localStorage.getItem('budgetory.contextBudget') ?? null
        if (storedContextBudgetId) setContextBudgetId(parseInt(storedContextBudgetId, 10))
    }, [])

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