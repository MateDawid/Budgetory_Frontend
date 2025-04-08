import React, {useContext, useEffect, useState} from 'react';
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import {
    Typography,
    Paper,
    Box
} from "@mui/material";
import {getApiObjectsList} from "../../app_infrastructure/services/APIService";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";
import BudgetCard from "../components/BudgetCard";

/**
 * BudgetList component to display list of User Budgets.
 */
export default function BudgetList() {
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/`
    const {alert, setAlert} = useContext(AlertContext);
    const {contextBudgetId} = useContext(BudgetContext);
    const [budgets, setBudgets] = useState([]);

    /**
     * Fetches Budgets list from API.
     */
    useEffect(() => {
        const loadData = async () => {
            if (!contextBudgetId) {
                return
            }
            try {
                const budgetsResponse = await getApiObjectsList(apiUrl)
                setBudgets(budgetsResponse);
            } catch (err) {
                setAlert({type: 'error', message: "Failed to Budgets."});
            }
        }
        loadData();
    }, [contextBudgetId]);

    return (
        <Paper elevation={24} sx={{
            padding: 2, bgColor: "#F1F1F1"
        }}>
            <Typography variant="h4" gutterBottom
                        sx={{display: 'block', color: '#BD0000'}}>Budgets</Typography>
            <Divider/>
            {alert && <Alert sx={{marginTop: 2, whiteSpace: 'pre-wrap'}} severity={alert.type}
                             onClose={() => setAlert(null)}>{alert.message}</Alert>}
            <Box spacing={1}
                 sx={{display: "flex", flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-around'}}>
                {budgets.map(budget => (
                    <Box key={budget.id} width={300}>
                        <BudgetCard budget={budget}/>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}
