import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiObjectsList } from "../services/APIService";
import { AlertContext } from "./AlertContext";

export const BudgetContext = createContext();

/**
 * ContextBudgetProvider for storing context Budget between pages.
 */
export const ContextBudgetProvider = ({ children }) => {
    const { setAlert } = useContext(AlertContext);
    const initialContextBudgetId = localStorage.getItem('budgetory.contextBudget')
        ? parseInt(localStorage.getItem('budgetory.contextBudget'), 10)
        : null;
    const initialContextBudgetCurrency = localStorage.getItem('budgetory.contextBudgetCurrency') || ''
    const [contextBudgetId, setContextBudgetId] = useState(initialContextBudgetId);
    const [contextBudgetCurrency, setContextBudgetCurrency] = useState(initialContextBudgetCurrency);
    const [updatedContextBudget, setUpdatedContextBudget] = useState(null)
    const [contextBudgetDeposits, setContextBudgetDeposits] = useState([])
    const [updatedContextBudgetDeposit, setUpdatedContextBudgetDeposit] = useState(null)
    const [refreshTimestamp, setRefreshTimestamp] = useState(null);
    const [loginTimestamp, setLoginTimestamp] = useState(null);
    const [logoutTimestamp, setLogoutTimestamp] = useState(null);


    /**
     * Updates refreshTimestampt to current time.
     */
    const updateRefreshTimestamp = () => {
        setRefreshTimestamp(Date.now())
    }

    /**
     * Updates loginTimestamp to current time.
     */
    const updateLoginTimestamp = () => {
        setLoginTimestamp(Date.now())
    }

    /**
     * Updates loginTimestamp to current time.
     */
    const updateLogoutTimestamp = () => {
        setLogoutTimestamp(Date.now())
    }

    /**
     * Saves context Budget data on login.
     */
    useEffect(() => {
        const loadContextBudget = async () => {
            if (!loginTimestamp) {
                return
            }
            if (!contextBudgetId) {
                const response = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/`)
                if (response?.length > 0) {
                    setContextBudgetId(response[0].id)
                    setContextBudgetCurrency(response[0].currency)
                    localStorage.setItem('budgetory.contextBudget', response[0].id)
                    localStorage.setItem('budgetory.contextBudgetCurrency', response[0].currency)
                }
                else {
                    setContextBudgetId(null)
                    localStorage.removeItem('budgetory.contextBudget')
                    localStorage.removeItem('budgetory.contextBudgetCurrency')
                    return
                }
            }
        }
        loadContextBudget();
    }, [loginTimestamp])

    /**
     * Saves contextBudgetId in localStorage on contextBudgetId change.
     */
    useEffect(() => {
        const loadBudgetDeposits = async () => {
            if (!contextBudgetId || ['/login', '/register'].includes(window.location.pathname)) {
                setAlert(null);
                setContextBudgetDeposits([])
                return
            }
            try {
                console.log(`Load from context budget - ${contextBudgetId}`)
                const response = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`)
                setContextBudgetDeposits(response);
            } catch (error) {
                console.error(error)
                setAlert({ type: 'error', message: "Failed to load Budget Deposits on Rightbar." });
                setContextBudgetDeposits([])
            }
        }
        loadBudgetDeposits();
    }, [contextBudgetId, updatedContextBudgetDeposit])

    /**
     * Clears context data on logout.
     */
    useEffect(() => {
        const handleLogout = async () => {
            setContextBudgetDeposits([])
            setContextBudgetId(null)
            setContextBudgetCurrency(null)
            setLoginTimestamp(null)
        }
        handleLogout();
    }, [logoutTimestamp])

    const value = {
        contextBudgetId,
        setContextBudgetId,
        updatedContextBudget,
        setUpdatedContextBudget,
        contextBudgetCurrency,
        setContextBudgetCurrency,
        contextBudgetDeposits,
        setUpdatedContextBudgetDeposit,
        refreshTimestamp,
        updateRefreshTimestamp,
        updateLoginTimestamp,
        updateLogoutTimestamp
    };

    return (
        <BudgetContext.Provider value={value}>
            {children}
        </BudgetContext.Provider>
    );
};