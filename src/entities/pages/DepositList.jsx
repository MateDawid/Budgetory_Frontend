import React, {useContext, useEffect, useState} from 'react';
import Typography from "@mui/material/Typography";
import {Box, Paper, Stack} from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import {AlertContext} from "../../app_infrastructure/components/AlertContext";
import {BudgetContext} from "../../app_infrastructure/components/BudgetContext";
import {getApiObjectsList} from "../../app_infrastructure/services/APIService";
import DepositCard from "../components/DepositCard";
import CreateButton from "../../app_infrastructure/components/CreateButton";


/**
 * DepositList component to display list of Budget Deposits.
 */
export default function DepositList() {
    const {contextBudgetId} = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`
    const {alert, setAlert} = useContext(AlertContext);
    const [addedObjectId, setAddedObjectId] = useState(null);
    const [updatedObjectId, setUpdatedObjectId] = useState(null);
    const [deletedObjectId, setDeletedObjectId] = useState(null);
    const [objects, setObjects] = useState([]);
    const createFields = {
        name: {
            type: 'string',
            label: 'Name',
            autoFocus: true,
            required: true
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
     * Fetches Deposits list from API.
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

    return (
        <Paper elevation={24} sx={{
            padding: 2, bgColor: "#F1F1F1"
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                <Typography variant="h4"
                            sx={{display: 'block', color: '#BD0000'}}>Deposits</Typography>
                <CreateButton objectName="Deposit" fields={createFields} apiUrl={apiUrl}
                              setAddedObjectId={setAddedObjectId}/>
            </Stack>
            <Divider/>
            {alert && <Alert sx={{marginTop: 2, whiteSpace: 'pre-wrap'}} severity={alert.type}
                             onClose={() => setAlert(null)}>{alert.message}</Alert>}
            <Box sx={{display: "flex", flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                {objects.map(object => (
                    <Box key={object.id} sx={{width: 330, m: 1}}>
                        <DepositCard
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