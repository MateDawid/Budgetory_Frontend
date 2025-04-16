import React, {useContext, useState} from 'react';
import Typography from "@mui/material/Typography";
import {Paper} from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import DataTable from "../../app_infrastructure/components/DataTable";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";


/**
 * BudgetingPeriodList component to display list of Budget BudgetingPeriods.
 */
export default function BudgetingPeriodList() {
    const {contextBudgetId} = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods/`
    const {alert, setAlert} = useContext(AlertContext);
    const [statusOptions, setStatusOptions] = useState([]);
    const columns = [
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
            field: 'status',
            type: 'singleSelect',
            headerName: 'Status',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
            valueOptions: statusOptions,
            valueOptionsSetter: setStatusOptions,
            valueOptionsApiUrl: `${process.env.REACT_APP_BACKEND_URL}/api/budgets/periods/statuses`
        },
        {
            field: 'date_start',
            type: 'date',
            headerName: 'Date start',
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
            field: 'date_end',
            type: 'date',
            headerName: 'Date end',
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
                            sx={{display: 'block', color: '#BD0000'}}>Periods</Typography>
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