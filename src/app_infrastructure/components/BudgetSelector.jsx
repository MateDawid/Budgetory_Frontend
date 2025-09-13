import React, { useState, useEffect, useContext } from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { BudgetContext } from "../store/BudgetContext";
import { getApiObjectsList } from "../services/APIService";

/**
 * BudgetSelector component to display Budget select field for used by DataGrid to obtain Budget data.
 */
const BudgetSelector = () => {
    const {
        contextBudgetId,
        setContextBudgetId,
        setContextBudgetCurrency
    } = useContext(BudgetContext);
    const [budgets, setBudgets] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState('');

    useEffect(() => {


    }, [])

    /**
     * Fetches Budgets to be selected in Select component from API and tries to get contextBudget from fetched Budgets.
     */
    useEffect(() => {
        const loadContextBudget = () => {
            if (contextBudgetId) {
                return contextBudgetId
            }
            const storageContextBudgetId = localStorage.getItem('budgetory.contextBudget')
                ? parseInt(localStorage.getItem('budgetory.contextBudget'), 10)
                : null;
            const storageContextBudgetCurrency = localStorage.getItem('budgetory.contextBudgetCurrency') || ''
            setContextBudgetId(storageContextBudgetId)
            setContextBudgetCurrency(storageContextBudgetCurrency)
            return storageContextBudgetId
        }
        const loadBudgets = async () => {
            try {
                const loadedBudgetId = loadContextBudget();
                const apiResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/`)
                setBudgets(apiResponse);
                if (apiResponse.length < 1) {
                    return
                }
                const contextBudget = apiResponse.find(budget => budget.id === loadedBudgetId);
                if (contextBudget) {
                    setSelectedBudget(contextBudget);
                }
                else {
                    setSelectedBudget(apiResponse[0]);
                    setContextBudgetId(apiResponse[0].id)
                    localStorage.setItem('budgetory.contextBudget', apiResponse[0].id)
                    localStorage.setItem('budgetory.contextBudgetCurrency', apiResponse[0].currency)
                }
            } catch (err) {
                setBudgets([]);
            }
        }
        loadBudgets();
    }, []);

    /**
     * Function to handle selecting new Budget in Select component.
     * Updates BudgetSelector state selectedBudget and updates localStorage with selected Budget id.
     * @param {PointerEvent} event - event on selecting Budget from Select component.
     */
    const handleChange = (event) => {
        setSelectedBudget(budgets.find(budget => budget.id === event.target.value.id));
        setContextBudgetId(event.target.value.id);
        setContextBudgetCurrency(event.target.value.currency);
        localStorage.setItem('budgetory.contextBudget', event.target.value.id)
        localStorage.setItem('budgetory.contextBudgetCurrency', event.target.value.currency)
    };

    return (
        <FormControl sx={{ width: '90%' }} >
            <InputLabel sx={{ fontWeight: 700 }} >
                Budget
            </InputLabel>
            <Select value={selectedBudget} onChange={handleChange} label="Budget" sx={{ width: '100%' }}>
                {budgets.map(budget => (
                    <MenuItem key={budget.id} value={budget}>
                        {budget.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default BudgetSelector;