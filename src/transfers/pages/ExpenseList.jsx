import React, { useContext } from 'react';
import Typography from "@mui/material/Typography";
import { Paper, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import { AlertContext } from "../../app_infrastructure/store/AlertContext";
import { BudgetContext } from "../../app_infrastructure/store/BudgetContext";
import TransferDataGrid from '../components/TransferDataGrid/TransferDataGrid';

/**
 * ExpenseList component to display list of Budget EXPENSE Transfers.
 */
export default function ExpenseList() {
    const { contextBudgetId } = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expenses/`
    const { alert, setAlert } = useContext(AlertContext);

    return (
        <>
            <Paper elevation={24} sx={{ padding: 2, bgColor: "#F1F1F1", }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                    <Typography variant="h4" sx={{ display: 'block', color: '#BD0000' }}>Expenses</Typography>
                </Stack>
                <Divider sx={{ marginBottom: 1 }} />
                {alert && <Alert sx={{ marginBottom: 1, whiteSpace: 'pre-wrap' }} severity={alert.type}
                    onClose={() => setAlert(null)}>{alert.message}</Alert>}
                <TransferDataGrid apiUrl={apiUrl}/>
            </Paper>
        </>
    );
}