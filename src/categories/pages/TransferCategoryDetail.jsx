import React, {useContext, useEffect, useState} from 'react';
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import {Typography, Paper, Box, Stack, Chip} from "@mui/material";
import {getApiObjectDetails} from "../../app_infrastructure/services/APIService";
import {useNavigate, useParams} from "react-router-dom";
import EditableTextField from "../../app_infrastructure/components/EditableTextField";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";
import DeleteButton from "../../app_infrastructure/components/DeleteButton";
import loadSelectOptionForCategory from "../utils/loadSelectOptionForCategory";
import onEditableFieldSave from "../../app_infrastructure/utils/onEditableFieldSave";

/**
 * TransferCategoryDetail component to display details of single Transfer Category.
 */
export default function TransferCategoryDetail() {
    const {id} = useParams();
    const navigate = useNavigate()
    const [updatedObjectParam, setUpdatedObjectParam] = useState(null);
    const {contextBudgetId} = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/`
    const {alert, setAlert} = useContext(AlertContext);
    const [objectData, setObjectData] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);
    const [priorityOptions, setPriorityOptions] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
    const objectFields = {
        name: {
            type: 'string',
            label: 'Name',
            autoFocus: true,
            required: true
        },
        category_type: {
            type: 'select',
            select: true,
            label: 'Type',
            required: true,
            disabled: true,
            options: typeOptions
        },
        priority: {
            type: 'select',
            select: true,
            label: 'Priority',
            required: true,
            options: priorityOptions
        },
        owner: {
            type: 'select',
            select: true,
            label: 'Owner',
            required: true,
            options: ownerOptions
        },
        description: {
            type: 'string',
            label: 'Description',
            required: false,
            multiline: true,
            rows: 4
        },
        is_active: {
            type: 'select',
            select: true,
            label: 'Status',
            defaultValue: true,
            required: true,
            options: [
                {
                    value: true,
                    label: '🟢 Active',
                },
                {
                    value: false,
                    label: '🔴 Inactive',
                }
            ]
        }
    }

    /**
     * Fetches Budgets list from API.
     */
    useEffect(() => {
        const loadData = async () => {
            try {
                const apiResponse = await getApiObjectDetails(apiUrl, id)
                setObjectData(apiResponse);
            } catch (err) {
                setAlert({type: 'error', message: 'Category details loading failed.'})
                navigate('/categories');
            }
        }
        loadData();
    }, [updatedObjectParam, contextBudgetId]);

    /**
     * Fetches select options for TransferCategory object from API.
     */
    useEffect(() => {
        loadSelectOptionForCategory(contextBudgetId, setTypeOptions, setPriorityOptions, setOwnerOptions, setAlert);
    }, [contextBudgetId]);

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
            padding: 2, bgColor: "#F1F1F1"
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                    <Typography variant="h4" sx={{display: 'block', color: '#BD0000'}}>{objectData.name}</Typography>
                    <Chip label={objectData.is_active ? "🟢 Active" : "🔴 Inactive"} variant="outlined"/>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                    <DeleteButton apiUrl={apiUrl} objectId={objectData.id} objectDisplayName="Transfer Category"
                                  redirectOnSuccess={'/categories'}/>
                </Stack>
            </Stack>
            <Divider/>
            {alert && <Alert sx={{marginTop: 2, whiteSpace: 'pre-wrap'}} severity={alert.type}
                             onClose={() => setAlert(null)}>{alert.message}</Alert>}
            <Box sx={{marginTop: 2}}>
                <Typography variant="h5" sx={{display: 'block', color: '#BD0000'}}>Details</Typography>
                <Divider sx={{marginBottom: 2}}/>
                {Object.keys(objectFields).map((fieldName) => (
                    <EditableTextField
                        key={fieldName}
                        apiFieldName={fieldName}
                        initialValue={objectData[fieldName]}
                        inputProps={objectFields[fieldName]['type'] === 'date' ? {max: '9999-12-31'} : {}}
                        fullWidth
                        onSave={onSave}
                        {...objectFields[fieldName]}
                    />
                ))}
            </Box>
        </Paper>
    );
}
