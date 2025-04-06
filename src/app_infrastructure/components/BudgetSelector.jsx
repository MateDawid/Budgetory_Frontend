import React, {useState, useEffect, useContext} from 'react';
import {Select, MenuItem, InputLabel, FormControl} from '@mui/material';
import {AlertContext} from "./AlertContext";
import {BudgetContext} from "./BudgetContext";
import {getApiObjectsList} from "../services/APIService";

/**
 * BudgetSelector component to display Budget select field for used by DataGrid to obtain Budget data.
 */
const BudgetSelector = () => {
    const {contextBudgetId, setContextBudgetId} = useContext(BudgetContext);
    const [budgets, setBudgets] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState('');
    const {setAlert} = useContext(AlertContext);

    /**
     * Fetches Budgets to be selected in Select component from API and tries to get contextBudget from fetched Budgets.
     */
    useEffect(() => {
        const loadData = async () => {
            try {
                const apiResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/`)
                setBudgets(apiResponse);
                const contextBudget = apiResponse.find(budget => budget.id === contextBudgetId);
                if (contextBudget) {
                    setSelectedBudget(contextBudget);
                }
            } catch (err) {
                setAlert({type: 'error', message: "Failed to load budgets"});
                setBudgets([]);
            }
        }
        loadData();
    }, [contextBudgetId]);

    /**
     * Function to handle selecting new Budget in Select component.
     * Updates BudgetSelector state selectedBudget and updates localStorage with selected Budget id.
     * @param {PointerEvent} event - event on selecting Budget from Select component.
     */
    const handleChange = (event) => {
        setContextBudgetId(event.target.value.id);
    };

    return (
        <FormControl sx={{ width: '90%' }} >
            <InputLabel sx={{fontWeight: 700}} >
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