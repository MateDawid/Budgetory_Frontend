import React, {useContext, useEffect, useState} from 'react';
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import {
    Typography,
    Paper,
    Box, Stack
} from "@mui/material";
import {getApiObjectDetails} from "../../app_infrastructure/services/APIService";
import {useNavigate, useParams} from "react-router-dom";
import EditableTextField from "../../app_infrastructure/components/EditableTextField";
import DataTable from "../../app_infrastructure/components/DataTable/DataTable";
import DeleteButton from "../../app_infrastructure/components/DeleteButton";
import onEditableFieldSave from "../../app_infrastructure/utils/onEditableFieldSave";

/**
 * BudgetDetail component to display details of single Budget.
 */
export default function BudgetDetail() {
    const {id} = useParams();
    const navigate = useNavigate()
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/`
    const [updatedObjectParam, setUpdatedObjectParam] = useState(null);
    const {alert, setAlert} = useContext(AlertContext);
    const [budgetData, setBudgetData] = useState([]);
    const depositsColumns = [
        {
            field: 'name',
            type: 'string',
            headerName: 'Name',
            headerAlign: 'center',
            align: 'left',
            flex: 2,
            filterable: true,
            sortable: true
        },
        {
            field: 'description',
            type: 'string',
            headerName: 'Description',
            headerAlign: 'center',
            align: 'left',
            flex: 3,
            filterable: true,
            sortable: false,
        },
        {
            field: 'is_active',
            type: 'boolean',
            headerName: 'Active',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            filterable: true,
            sortable: false,
        },
        {
            field: 'balance',
            type: 'number',
            headerName: 'Balance',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            filterable: true,
            sortable: true,
            valueFormatter: (value) => {
                return value !== undefined ? `${value} ${budgetData.currency}` : '';
            }

        },
    ]

    /**
     * Fetches Budget details from API.
     */
    useEffect(() => {
        const loadData = async () => {
            try {
                const budgetResponse = await getApiObjectDetails(apiUrl, id)
                setBudgetData(budgetResponse);
            } catch (err) {
                setAlert({type: 'error', message: 'Budget details loading failed.'})
                navigate('/budgets');
            }
        }
        loadData();
    }, [updatedObjectParam]);

    /**
     * Function to save updated object via API call.
     * @param {string} apiFieldName - Name of updated API field.
     * @param {object} value - New value for updated API field.
     * @return {object} - JSON data with API response.
     */
    const onSave = async (apiFieldName, value) => {
        await onEditableFieldSave(id, apiFieldName, value, apiUrl, setUpdatedObjectParam, setAlert)
    };

    return (
        <Paper elevation={24} sx={{
            padding: 2, paddingBottom: 0, bgColor: "#F1F1F1"
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                <Typography variant="h4" sx={{display: 'block', color: '#BD0000'}}>{budgetData.name}</Typography>
                <DeleteButton apiUrl={apiUrl} objectId={id} objectDisplayName="Budget" redirectOnSuccess={'/budgets'}/>
            </Stack>
            <Divider/>
            {alert && <Alert sx={{marginTop: 2, whiteSpace: 'pre-wrap'}} severity={alert.type}
                             onClose={() => setAlert(null)}>{alert.message}</Alert>}
            <Box sx={{marginTop: 2}}>
                <Typography variant="h5" sx={{display: 'block', color: '#BD0000'}}>Details</Typography>
                <Divider sx={{marginBottom: 2}}/>
                <EditableTextField
                    label="Name"
                    initialValue={budgetData.name}
                    apiFieldName="name"
                    onSave={onSave}
                    fullWidth
                />
                <EditableTextField
                    multiline
                    rows={4}
                    label="Description"
                    initialValue={budgetData.description}
                    apiFieldName="description"
                    onSave={onSave}
                    fullWidth
                />
                <EditableTextField
                    label="Currency"
                    initialValue={budgetData.currency}
                    apiFieldName="currency"
                    onSave={onSave}
                    fullWidth
                />
            </Box>
            <Box>
                <Typography variant="h5" sx={{display: 'block', color: '#BD0000'}}>Deposits</Typography>
                <Divider sx={{marginBottom: 2}}/>
                <DataTable
                    columns={depositsColumns}
                    apiUrl={`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${id}/deposits/`}
                    readOnly
                    clientUrl='/deposits/'
                    height={300}
                />
            </Box>
        </Paper>
    );
}
