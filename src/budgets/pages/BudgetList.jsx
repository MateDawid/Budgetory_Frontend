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
import CreateButton from "../../app_infrastructure/components/CreateButton";

/**
 * BudgetList component to display list of User Budgets.
 */
export default function BudgetList() {
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/`
    const {alert, setAlert} = useContext(AlertContext);
    const [addedBudgetId, setAddedBudgetId] = useState(null);
    const [deletedBudgetId, setDeletedBudgetId] = useState(null);
    const [budgets, setBudgets] = useState([]);
    const createFields = {
        name: {
            type: 'string',
            label: 'Name',
            autoFocus: true,
            required: true
        },
        description: {
            type: 'string',
            label: 'Description',
            multiline: true,
            rows: 4
        },
        currency: {
            type: 'string',
            label: 'Currency',
            required: true,
        }
    }

    /**
     * Fetches Budgets list from API.
     */
    useEffect(() => {
        const loadData = async () => {
            try {
                const budgetsResponse = await getApiObjectsList(apiUrl)
                setBudgets(budgetsResponse);
            } catch (err) {
                setAlert({type: 'error', message: "Failed to load Budgets."});
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
                <CreateButton objectName="Budget" fields={createFields} apiUrl={apiUrl} setAddedObjectId={setAddedBudgetId}/>
            </Stack>
            <Divider/>
            {alert && <Alert sx={{marginTop: 2, whiteSpace: 'pre-wrap'}} severity={alert.type}
                             onClose={() => setAlert(null)}>{alert.message}</Alert>}
            <Box sx={{display: "flex", flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                {budgets.map(budget => (
                    <Box key={budget.id} sx={{width: 300, m: 1}}>
                        <BudgetCard budget={budget} setDeletedBudgetId={setDeletedBudgetId}/>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}
