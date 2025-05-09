import React, {useContext, useEffect, useState} from 'react';
import Typography from "@mui/material/Typography";
import {Paper, Stack} from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import DataTable from "../../app_infrastructure/components/DataTable";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";
import CreateButton from "../../app_infrastructure/components/CreateButton";
import loadSelectOptionsForTransfer from "../utils/loadSelectOptionsForTransfer";
import CategoryTypes from "../../categories/utils/CategoryTypes";

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
    const [addedObjectId, setAddedObjectId] = useState(null);
    const createFields = {
        name: {
            type: 'string',
            label: 'Name',
            autoFocus: true,
            required: true
        },
        value: {
            type: 'number',
            label: 'Value',
            autoFocus: true,
            required: true
        },
        date: {
            type: 'date',
            label: 'Date',
            required: true,
        },
        period: {
            type: 'select',
            select: true,
            selectValue: 'id',
            selectLabel: 'name',
            label: 'Period',
            required: true,
            options: periodOptions
        },
        entity: {
            type: 'select',
            select: true,
            label: 'Entity',
            required: true,
            options: entityOptions,
        },
        deposit: {
            type: 'select',
            select: true,
            label: 'Deposit',
            required: true,
            options: depositOptions
        },
        category: {
            type: 'select',
            select: true,
            label: 'Category',
            required: true,
            options: categoryOptions
        },
        description: {
            type: 'string',
            label: 'Description',
            required: false,
            multiline: true,
            rows: 4
        },
    }
    const columns = [
        {
            field: 'date',
            type: 'date',
            headerName: 'Date',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: false,
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
            editable: false,
            valueOptions: periodOptions,
        },
        {
            field: 'entity',
            type: 'singleSelect',
            headerName: 'Entity',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: false,
            valueOptions: entityOptions,
        },
        {
            field: 'name',
            type: 'string',
            headerName: 'Name',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: false,
        },
        {
            field: 'category',
            type: 'singleSelect',
            headerName: 'Category',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: false,
            valueOptions: categoryOptions,
        },
        {
            field: 'value',
            type: 'number',
            headerName: 'Value',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: false,
        },
        {
            field: 'deposit',
            type: 'singleSelect',
            headerName: 'Deposit',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: false,
            valueOptions: depositOptions,
        },
        {
            field: 'description',
            type: 'string',
            headerName: 'Description',
            flex: 2,
            filterable: true,
            sortable: false,
            editable: false,
        },
    ]
    /**
     * Fetches select options for Income object from API.
     */
    useEffect(() => {
        loadSelectOptionsForTransfer(contextBudgetId, CategoryTypes.INCOME, setPeriodOptions, setEntityOptions, setDepositOptions, setCategoryOptions, setAlert);
    }, [contextBudgetId]);

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
                    <CreateButton objectName="Income" fields={createFields} apiUrl={apiUrl}
                                  setAddedObjectId={setAddedObjectId}/>
                </Stack>
                <Divider sx={{marginBottom: 1}}/>
                {alert && <Alert sx={{marginBottom: 1, whiteSpace: 'pre-wrap'}} severity={alert.type}
                                 onClose={() => setAlert(null)}>{alert.message}</Alert>}
                <DataTable
                    columns={columns}
                    apiUrl={apiUrl}
                    addedObjectId={addedObjectId}
                />
            </Paper>
        </>
    );
}