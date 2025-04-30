import React, {useContext, useEffect, useState} from 'react';
import Typography from "@mui/material/Typography";
import {Box, Paper, Stack} from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";
import {getApiObjectsList} from "../../app_infrastructure/services/APIService";
import TransferCategoryCard from "../components/TransferCategoryCard";
import CreateButton from "../../app_infrastructure/components/CreateButton";


/**
 * TransferCategoryList component to display list of Budget TransferCategories.
 */
export default function TransferCategoryList() {
    const {contextBudgetId} = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/`
    const {alert, setAlert} = useContext(AlertContext);
    const [addedObjectId, setAddedObjectId] = useState(null);
    const [updatedObjectId, setUpdatedObjectId] = useState(null);
    const [deletedObjectId, setDeletedObjectId] = useState(null);
    const [objects, setObjects] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);
    const [priorityOptions, setPriorityOptions] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
    const createFields = {
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
     * Fetches TransferCategories list from API.
     */
    useEffect(() => {
        const loadData = async () => {
            try {
                const listResponse = await getApiObjectsList(apiUrl)
                setObjects(listResponse);
            } catch (err) {
                setAlert({type: 'error', message: "Failed to load Periods."});
            }
        }
        loadData();
    }, [contextBudgetId, addedObjectId, updatedObjectId, deletedObjectId]);

    /**
     * Fetches TransferCategories list from API.
     */
    useEffect(() => {
        const loadData = async () => {
            try {
                const typeResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/categories/types`)
                setTypeOptions(typeResponse.results);
                const priorityResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/categories/priorities`)
                setPriorityOptions(priorityResponse.results);
                const ownerResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/members/`)
                setOwnerOptions([{value: -1, label: 'Common'}, ...ownerResponse]);
            } catch (err) {
                console.error(err)
                setAlert({type: 'error', message: "Failed to load select options."});
            }
        }
        loadData();
    }, [contextBudgetId]);

    return (
        <Paper elevation={24} sx={{
            padding: 2, bgColor: "#F1F1F1"
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                <Typography variant="h4"
                            sx={{display: 'block', color: '#BD0000'}}>Transfer Categories</Typography>
                <CreateButton objectName="Transfer Category" fields={createFields} apiUrl={apiUrl}
                              setAddedObjectId={setAddedObjectId}/>
            </Stack>
            <Divider/>
            {alert && <Alert sx={{marginTop: 2, whiteSpace: 'pre-wrap'}} severity={alert.type}
                             onClose={() => setAlert(null)}>{alert.message}</Alert>}
            <Box sx={{display: "flex", flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                {objects.map(object => (
                    <Box key={object.id} sx={{width: 330, m: 1}}>
                        <TransferCategoryCard
                            apiUrl={apiUrl}
                            object={object}
                            setUpdatedObjectId={setUpdatedObjectId}
                            setDeletedObjectId={setDeletedObjectId}
                        />
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}