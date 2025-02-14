import React, {useContext} from 'react';
import Typography from "@mui/material/Typography";
import {Paper} from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import {
    getBudgetingPeriodList,
    createBudgetingPeriod,
    updateBudgetingPeriod,
    deleteBudgetingPeriod
} from "../services/BudgetingPeriodService";
import DataTable from "../../app_infrastructure/components/DataTable";


/**
 * BudgetingPeriodList component to display list of Budget BudgetingPeriods.
 */
export default function BudgetingPeriodListNew() {
    const {alert, setAlert} = useContext(AlertContext);
    const columns = [
        {field: 'name', headerName: 'Name', flex: 3, filterable: false, sortable: false, editable: true},
        {
            field: 'date_start',
            type: 'date',
            headerName: 'Date start',
            flex: 2,
            filterable: false,
            sortable: false,
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
            filterable: false,
            sortable: false,
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
            field: 'is_active',
            type: 'boolean',
            headerName: 'Active',
            flex: 1,
            filterable: false,
            sortable: false,
            editable: true
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
                    apiListFunction={getBudgetingPeriodList}
                    apiCreateFunction={createBudgetingPeriod}
                    apiUpdateFunction={updateBudgetingPeriod}
                    apiDeleteFunction={deleteBudgetingPeriod}
                />
            </Paper>
        </>
    );
}