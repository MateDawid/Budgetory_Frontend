import React, { useContext } from 'react';
import Typography from "@mui/material/Typography";
import { Paper, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import { AlertContext } from "../../app_infrastructure/store/AlertContext";
import TransferDataGrid from '../components/TransferDataGrid/TransferDataGrid';
import TransferTypes from '../utils/TransferTypes';

/**
 * IncomeList component to display list of Budget INCOME Transfers.
 */
export default function IncomeList() {
    const { alert, setAlert } = useContext(AlertContext);

    return (
        <>
            <Paper elevation={24} sx={{ padding: 2, bgColor: "#F1F1F1", }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                    <Typography variant="h4"
                        sx={{ display: 'block', color: '#BD0000' }}>Incomes</Typography>
                </Stack>
                <Divider sx={{ marginBottom: 1 }} />
                {alert && <Alert sx={{ marginBottom: 1, whiteSpace: 'pre-wrap' }} severity={alert.type}
                    onClose={() => setAlert(null)}>{alert.message}</Alert>}
                <TransferDataGrid transferType={TransferTypes.INCOME}/>
            </Paper>
        </>
    );
}