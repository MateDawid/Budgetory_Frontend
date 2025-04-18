import React, {useContext, useEffect, useState} from 'react';
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import {
    Typography,
    Paper,
    Box, Stack
} from "@mui/material";
import {getApiObjectDetails, updateApiObject} from "../../app_infrastructure/services/APIService";
import {useParams} from "react-router-dom";
import EditableTextField from "../../app_infrastructure/components/EditableTextField";
import BudgetDeleteButton from "../components/BudgetDeleteButton";
import ApiError from "../../app_infrastructure/utils/ApiError";
import DataTable from "../../app_infrastructure/components/DataTable";

/**
 * BudgetDetail component to display details of single Budget.
 */
export default function BudgetDetail() {
    const {id} = useParams();
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/`
    const {alert, setAlert} = useContext(AlertContext);
    const [budgetData, setBudgetData] = useState([]);
    const depositsColumns = [
        {
            field: 'name',
            type: 'string',
            headerName: 'Name',
            flex: 2,
            filterable: true,
            sortable: true
        },
        {
            field: 'description',
            type: 'string',
            headerName: 'Description',
            flex: 3,
            filterable: true,
            sortable: false,
        },
        {
            field: 'is_active',
            type: 'boolean',
            headerName: 'Active',
            flex: 1,
            filterable: true,
            sortable: false,
        },
        {
            field: 'balance',
            type: 'number',
            headerName: 'Balance',
            flex: 1,
            filterable: true,
            sortable: true,
            valueFormatter: (value) => {
                return value !== undefined ? `${value} ${budgetData.currency}` : '';
            }

        },
    ]

    /**
     * Fetches Budgets list from API.
     */
    useEffect(() => {
        const loadData = async () => {
            try {
                const budgetResponse = await getApiObjectDetails(apiUrl, id)
                setBudgetData(budgetResponse);
            } catch (err) {
                setAlert({type: 'error', message: "Failed to load Budget."});
            }
        }
        loadData();
    }, []);

    /**
     * Function to save updated object via API call.
     * @param {string} apiFieldName - Name of updated API field.
     * @param {object} value - New value for updated API field.
     * @return {object} - JSON data with API response.
     */
    const onSave = async (apiFieldName, value) => {
        let payload = {id: id, [apiFieldName]: value}
        try {
            const response = await updateApiObject(apiUrl, payload);
            if (!response.ok) {
                throw new ApiError(response.data.detail[apiFieldName].join(' | '));
            }
        } catch (error) {
            setAlert({type: 'error', message: 'Budget update failed.'})
            if (error instanceof ApiError) {
                throw error
            }
            else {
                console.error(error)
                throw Error('Unexpected error occurred.')
            }
        }

        setAlert({type: 'success', message: 'Budget updated successfully.'})
    };

    return (
        <Paper elevation={24} sx={{
            padding: 2, bgColor: "#F1F1F1"
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                <Typography variant="h4" sx={{display: 'block', color: '#BD0000'}}>{budgetData.name}</Typography>
                <BudgetDeleteButton budgetId={id} redirectOnSuccess={'/budgets'}/>
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
                    clientUrl='/deposits/'
                />
            </Box>
        </Paper>
    );
}
