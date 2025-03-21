import React, {useContext, useState} from 'react';
import Typography from "@mui/material/Typography";
import {Paper} from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import DataTable from "../../app_infrastructure/components/DataTable";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";

/**
 * TransferCategoryList component to display list of Budget TransferCategories.
 */
export default function TransferCategoryList() {
    const {contextBudgetId} = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/`
    const {alert, setAlert} = useContext(AlertContext);
    const [typeOptions, setTypeOptions] = useState([]);
    const [priorityOptions, setPriorityOptions] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
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
            field: 'category_type',
            type: 'singleSelect',
            headerName: 'Type',
            flex: 3,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: typeOptions,
            valueOptionsSetter: setTypeOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/categories/types`
        },
        {
            field: 'priority',
            type: 'singleSelect',
            headerName: 'Priority',
            flex: 3,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: priorityOptions,
            valueOptionsSetter: setPriorityOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/categories/priorities`
        },
        {
            field: 'owner',
            type: 'singleSelect',
            headerName: 'Owner',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: ownerOptions,
            nullChoice: {value: -1, label: 'Common'},
            valueOptionsSetter: setOwnerOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/members`,
        },
        {
            field: 'is_active',
            type: 'boolean',
            headerName: 'Active',
            flex: 1,
            filterable: true,
            sortable: false,
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
                            sx={{display: 'block', color: '#BD0000'}}>Transfer categories</Typography>
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