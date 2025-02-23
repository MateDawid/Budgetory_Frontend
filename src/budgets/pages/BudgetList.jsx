import React, {useContext} from 'react';
import Typography from "@mui/material/Typography";
import {Paper} from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import DataTable from "../../app_infrastructure/components/DataTable";


/**
 * BudgetList component to display list of User Budgets.
 */
export default function BudgetList() {
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/`
    const {alert, setAlert} = useContext(AlertContext);
    const columns = [
        {
            field: 'name',
            headerClassName: '.datagrid--header',
            headerName: 'Name',
            flex: 2,
            filterable: true,
            sortable: true,
            editable: true,
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 7,
            filterable: false,
            sortable: false,
            editable: true,
        },
        {
            field: 'currency',
            headerName: 'Currency',
            flex: 2,
            filterable: false,
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
                            sx={{display: 'block', color: '#BD0000'}}>Budgets</Typography>
                <Divider/>
                {alert && <Alert sx={{marginTop: 2, whiteSpace: 'pre-wrap'}} severity={alert.type}
                                 onClose={() => setAlert(null)}>{alert.message}</Alert>}
                <DataTable
                    columns={columns}
                    apiUrl={apiUrl}
                    useContextBudget={false}
                />
            </Paper>
        </>
    );
}