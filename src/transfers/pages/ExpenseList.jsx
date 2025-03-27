import React, {useContext, useState} from 'react';
import Typography from "@mui/material/Typography";
import {Paper} from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import DataTable from "../../app_infrastructure/components/DataTable";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";

/**
 * ExpenseList component to display list of Budget INCOME Transfers.
 */
export default function ExpenseList() {
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
            flex: 3,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: periodOptions,
            valueOptionsSetter: setPeriodOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods`,
        },
        {
            field: 'entity',
            type: 'singleSelect',
            headerName: 'Entity',
            flex: 3,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: entityOptions,
            valueOptionsSetter: setEntityOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/entities?page_size=1000`,
        },
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
            field: 'category',
            type: 'singleSelect',
            headerName: 'Category',
            flex: 3,
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
            flex: 3,
            filterable: true,
            sortable: true,
            editable: false,
        },
        {
            field: 'deposit',
            type: 'singleSelect',
            headerName: 'Deposit',
            flex: 3,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: depositOptions,
            valueOptionsSetter: setDepositOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits`,
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
                            sx={{display: 'block', color: '#BD0000'}}>Expenses</Typography>
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