import React, {useContext, useState} from 'react';
import Typography from "@mui/material/Typography";
import {Paper, Stack} from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";
import DataTable from "../../app_infrastructure/components/DataTable";

/**
 * IncomeList component to display list of Budget INCOME Transfers.
 */
export default function IncomeList() {
    const {contextBudgetId} = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/incomes/`
    const {alert, setAlert} = useContext(AlertContext);
    const [periodOptions, setPeriodOptions] = useState([]);
    const [entityOptions, setEntityOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [depositOptions, setDepositOptions] = useState([]);
    const columns = [
        {
            field: 'date',
            type: 'date',
            headerName: 'Date',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
            valueGetter: (value) => {
                return new Date(value);
            },
            valueFormatter: (value) => {
                try {
                    return value.toLocaleDateString('en-CA')
                } catch (error) {
                    return value
                }
            },
        },
        {
            field: 'period',
            type: 'singleSelect',
            headerName: 'Period',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: periodOptions,
            valueOptionsSetter: setPeriodOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods/`,
        },
        {
            field: 'name',
            type: 'string',
            headerName: 'Name',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
        },
        {
            field: 'entity',
            type: 'singleSelect',
            headerName: 'Entity',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: entityOptions,
            valueOptionsSetter: setEntityOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/entities/?page_size=1000`,
        },
        {
            field: 'deposit',
            type: 'singleSelect',
            headerName: 'Deposit',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: depositOptions,
            valueOptionsSetter: setDepositOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`,
        },
        {
            field: 'category',
            type: 'singleSelect',
            headerName: 'Category',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: categoryOptions,
            valueOptionsSetter: setCategoryOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/?category_type=1`,
        },
        {
            field: 'value',
            type: 'number',
            headerName: 'Value',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
        },
        {
            field: 'description',
            type: 'string',
            headerName: 'Description',
            flex: 2,
            filterable: true,
            sortable: false,
            editable: true,
        },
    ]

    return (
        <>
            <Paper elevation={24} sx={{
                padding: 2, bgColor: "#F1F1F1",
                '& .datagrid--header': {
                    backgroundColor: '#BD0000',
                }
            }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                    <Typography variant="h4"
                                sx={{display: 'block', color: '#BD0000'}}>Incomes</Typography>
                </Stack>
                <Divider sx={{marginBottom: 1}}/>
                {alert && <Alert sx={{marginBottom: 1, whiteSpace: 'pre-wrap'}} severity={alert.type}
                                 onClose={() => setAlert(null)}>{alert.message}</Alert>}
                <DataTable
                    columns={columns}
                    apiUrl={apiUrl}
                />
            </Paper>
        </>
    );
}