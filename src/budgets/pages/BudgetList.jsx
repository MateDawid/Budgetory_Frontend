import React, {useContext, useEffect, useState} from 'react';
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import {
    Typography,
    Paper,
    Box, Stack
} from "@mui/material";
import {getApiObjectsList} from "../../app_infrastructure/services/APIService";
import BudgetCard from "../components/BudgetCard";
import BudgetAddButton from "./BudgetAddButton";

/**
 * BudgetList component to display list of User Budgets.
 */
export default function BudgetList() {
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/`
    const {alert, setAlert} = useContext(AlertContext);
    const [addedBudgetId, setAddedBudgetId] = useState(null);
    const [deletedBudgetId, setDeletedBudgetId] = useState(null);
    const [budgets, setBudgets] = useState([]);

    /**
     * Fetches Budgets list from API.
     */
    useEffect(() => {
        const loadData = async () => {
            try {
                const budgetsResponse = await getApiObjectsList(apiUrl)
                setBudgets(budgetsResponse);
            } catch (err) {
                setAlert({type: 'error', message: "Failed to Budgets."});
            }
        }
        loadData();
    }, [addedBudgetId, deletedBudgetId]);

    return (
        <Paper elevation={24} sx={{
            padding: 2, bgColor: "#F1F1F1"
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                <Typography variant="h4"
                            sx={{display: 'block', color: '#BD0000'}}>Budgets</Typography>
                <BudgetAddButton setAddedBudgetId={setAddedBudgetId}/>
            </Stack>
            <Divider/>
            {alert && <Alert sx={{marginTop: 2, whiteSpace: 'pre-wrap'}} severity={alert.type}
                             onClose={() => setAlert(null)}>{alert.message}</Alert>}
            <Box spacing={1}
                 sx={{display: "flex", flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-around'}}>
                {budgets.map(budget => (
                    <Box key={budget.id} width={300}>
                        <BudgetCard budget={budget} setDeletedBudgetId={setDeletedBudgetId}/>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}
