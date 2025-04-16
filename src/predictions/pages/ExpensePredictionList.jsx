import React, {useContext, useState} from 'react';
import Typography from "@mui/material/Typography";
import {Paper} from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import DataTable from "../../app_infrastructure/components/DataTable";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";

/**
 * ExpensePredictionList component to display list of Budget ExpensePredictions.
 */
export default function ExpensePredictionList() {
    const {contextBudgetId} = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expense_predictions/`
    const {alert, setAlert} = useContext(AlertContext);
    const [periodOptions, setPeriodOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const columns = [
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
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods`,
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
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/?category_type=2`,
        },
        {
            field: 'initial_value',
            type: 'number',
            headerName: 'Initial Value',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: false,
        },
        {
            field: 'current_value',
            type: 'number',
            headerName: 'Current Value',
            flex: 2,
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
                            sx={{display: 'block', color: '#BD0000'}}>Expense predictions</Typography>
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