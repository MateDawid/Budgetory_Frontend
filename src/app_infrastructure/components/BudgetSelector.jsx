import React, {useState, useEffect, useContext} from 'react';
import {Select, MenuItem, InputLabel} from '@mui/material';
import {getBudgetList} from "../../budgets/services/BudgetService";
import {AlertContext} from "./AlertContext";
import Box from "@mui/material/Box";
import {BudgetContext} from "./BudgetContext";

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
                const apiResponse = await getBudgetList();
                setBudgets(apiResponse.results);
                const contextBudget = apiResponse.results.find(budget => budget.id === contextBudgetId);
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
        <Box component="form" display="flex" alignItems="center" justifyContent="left"
             sx={{width: '100%', maxWidth: '100%', marginTop: 2}}>
            <InputLabel sx={{fontWeight: 700, marginRight: 2}}>
                Budget
            </InputLabel>
            <Select value={selectedBudget} onChange={handleChange} sx={{minWidth: '15%', maxWidth: "35%"}}>
                {budgets.map(budget => (
                    <MenuItem key={budget.id} value={budget}>
                        {budget.name}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

export default BudgetSelector;