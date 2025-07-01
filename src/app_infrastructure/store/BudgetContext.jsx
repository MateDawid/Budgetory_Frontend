import React, {createContext, useContext, useEffect, useState} from 'react';
import {getApiObjectsList} from "../services/APIService";
import {AlertContext} from "./AlertContext";

export const BudgetContext = createContext();

/**
 * ContextBudgetProvider for storing context Budget between pages.
 */
export const ContextBudgetProvider = ({children}) => {
    const {setAlert} = useContext(AlertContext);
    const initialContextBudgetId = localStorage.getItem('budgetory.contextBudget')
        ? parseInt(localStorage.getItem('budgetory.contextBudget'), 10)
        : null;
    const initialContextBudgetCurrency = localStorage.getItem('budgetory.contextBudgetCurrency') || ''
    const [contextBudgetId, setContextBudgetId] = useState(initialContextBudgetId);
    const [contextBudgetCurrency, setContextBudgetCurrency] = useState(initialContextBudgetCurrency);
    const [updatedContextBudget, setUpdatedContextBudget] = useState(null)
    const [contextBudgetDeposits, setContextBudgetDeposits] = useState([])
    const [updatedContextBudgetDeposit, setUpdatedContextBudgetDeposit] = useState(null)
    const [objectChange, setObjectChange] = useState({operation: null, objectId: null, objectType: null});

    /**
     * Saves contextBudgetId in localStorage on contextBudgetId change.
     */
    useEffect(() => {
        const loadData = async () => {
            if (!contextBudgetId) {
                setContextBudgetDeposits([])
            }
            try {
                const response = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`)
                setContextBudgetDeposits(response);
            } catch (error) {
                console.error(error)
                setAlert({type: 'error', message: "Failed to load Budget Deposits on Rightbar."});
                setContextBudgetDeposits([])
            }
        }

        if (contextBudgetId) {
            localStorage.setItem('budgetory.contextBudget', contextBudgetId)
            localStorage.setItem('budgetory.contextBudgetCurrency', contextBudgetCurrency)
        }
        loadData();
    }, [contextBudgetId, updatedContextBudgetDeposit])

    const value = {
        contextBudgetId,
        setContextBudgetId,
        updatedContextBudget,
        setUpdatedContextBudget,
        contextBudgetCurrency,
        setContextBudgetCurrency,
        contextBudgetDeposits,
        setUpdatedContextBudgetDeposit,
        objectChange,
        setObjectChange
    };

    return (
        <BudgetContext.Provider value={value}>
            {children}
        </BudgetContext.Provider>
    );
};