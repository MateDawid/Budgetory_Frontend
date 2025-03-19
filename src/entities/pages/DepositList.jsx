import React, {useContext} from 'react';
import Typography from "@mui/material/Typography";
import {Paper} from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import DataTable from "../../app_infrastructure/components/DataTable";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";

/**
 * DepositList component to display list of Budget Deposits.
 */
export default function DepositList() {
    const {contextBudgetId} = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`
    const {alert, setAlert} = useContext(AlertContext);
    const columns = [
        {
            field: 'name',
            type: 'string',
            headerName: 'Name',
            flex: 3,
            filterable: true,
            sortable: true,
            editable: true,
        },
        {
            field: 'description',
            type: 'string',
            headerName: 'Description',
            flex: 3,
            filterable: true,
            sortable: false,
            editable: true,
        },
        {
            field: 'is_active',
            type: 'boolean',
            headerName: 'Active',
            flex: 1,
            filterable: true,
            sortable: false,
            editable: true,
        }
    ]

    return (
        <>
            <Paper elevation={24} sx={{
                padding: 2, bgColor: "#F1F1F1", width: '100%', maxWidth: '100%',
                '& .datagrid--header': {
                    backgroundColor: '#BD0000',
                }
            }}>
                <Typography variant="h4" gutterBottom
                            sx={{display: 'block', color: '#BD0000'}}>Deposits</Typography>
                <Divider/>
                {alert && <Alert sx={{marginTop: 2, whiteSpace: 'pre-wrap'}} severity={alert.type}
                                 onClose={() => setAlert(null)}>{alert.message}</Alert>}
                <DataTable
                    columns={columns}
                    apiUrl={apiUrl}
                />
            </Paper>
        </>
    );
}