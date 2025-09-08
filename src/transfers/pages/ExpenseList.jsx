import React, { useContext, useState } from 'react';
import Typography from "@mui/material/Typography";
import { Paper, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import { AlertContext } from "../../app_infrastructure/store/AlertContext";
import { BudgetContext } from "../../app_infrastructure/store/BudgetContext";
import DataTable from "../../app_infrastructure/components/DataTable/DataTable";
import AutocompleteCell from "../../app_infrastructure/components/DataTable/AutocompleteCell";
import TransferValueInputCell from "../../app_infrastructure/components/DataTable/TransferValueInputCell";

/**
 * ExpenseList component to display list of Budget EXPENSE Transfers.
 */
export default function ExpenseList() {
    const { contextBudgetId, contextBudgetCurrency } = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expenses/`
    const { alert, setAlert } = useContext(AlertContext);
    const [periodOptions, setPeriodOptions] = useState([]);
    const [entityOptions, setEntityOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [depositOptions, setDepositOptions] = useState([]);
    const columns = [
        {
            field: 'date',
            type: 'date',
            headerName: 'Date',
            headerAlign: 'center',
            align: 'center',
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
            headerAlign: 'center',
            align: 'center',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: periodOptions,
            valueOptionsSetter: setPeriodOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods/`,
            renderEditCell: (params) => <AutocompleteCell{...params} />
        },
        {
            field: 'name',
            type: 'string',
            headerName: 'Name',
            headerAlign: 'center',
            align: 'center',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
        },
        {
            field: 'deposit',
            type: 'singleSelect',
            headerName: 'Deposit',
            headerAlign: 'center',
            align: 'center',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: depositOptions,
            valueOptionsSetter: setDepositOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`,
            renderEditCell: (params) => <AutocompleteCell{...params} />
        },
        {
            field: 'entity',
            type: 'singleSelect',
            headerName: 'Receiver',
            headerAlign: 'center',
            align: 'center',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: entityOptions,
            valueOptionsSetter: setEntityOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/entities/?ordering=is_deposit,name`,
            renderEditCell: (params) => <AutocompleteCell {...params} groupBy={(option) => option.is_deposit ? 'Deposits' : 'Entities'} />

        },
        {
            field: 'category',
            type: 'singleSelect',
            headerName: 'Category',
            headerAlign: 'center',
            align: 'center',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: categoryOptions,
            valueOptionsSetter: setCategoryOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/?ordering=owner,name&category_type=2`,
            renderEditCell: (params) => <AutocompleteCell {...params} groupBy={(option) => option.owner_display} />
        },

        {
            field: 'value',
            type: 'number',
            headerName: 'Value',
            headerAlign: 'center',
            align: 'center',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
            valueFormatter: (value) => `${value} ${contextBudgetCurrency}`,
            renderEditCell: (params) => <TransferValueInputCell {...params} />,
        },

        {
            field: 'description',
            type: 'string',
            headerName: 'Description',
            headerAlign: 'center',
            align: 'left',
            flex: 2,
            filterable: true,
            sortable: false,
            editable: true,
        },
    ]

    return (
        <>
            <Paper elevation={24} sx={{ padding: 2, paddingBottom: 0, bgColor: "#F1F1F1", }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                    <Typography variant="h4" sx={{ display: 'block', color: '#BD0000' }}>Expenses</Typography>
                </Stack>
                <Divider sx={{ marginBottom: 1 }} />
                {alert && <Alert sx={{ marginBottom: 1, whiteSpace: 'pre-wrap' }} severity={alert.type}
                    onClose={() => setAlert(null)}>{alert.message}</Alert>}
                <DataTable
                    columns={columns}
                    apiUrl={apiUrl}
                    rightbarDepositsRefresh
                />
            </Paper>
        </>
    );
}