import React, { useContext, useEffect, useState } from 'react';
import Typography from "@mui/material/Typography";
import { Box, Paper, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import { AlertContext } from "../../app_infrastructure/store/AlertContext";
import { BudgetContext } from "../../app_infrastructure/store/BudgetContext";
import { getApiObjectsList } from "../../app_infrastructure/services/APIService";
import DepositCard from "../components/DepositCard";
import CreateButton from "../../app_infrastructure/components/CreateButton";


/**
 * DepositList component to display list of Budget Deposits.
 */
export default function DepositList() {
    const { contextBudgetId, refreshTimestamp } = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`
    const { setAlert } = useContext(AlertContext);
    const [updatedObjectId, setUpdatedObjectId] = useState(null);
    const [deletedObjectId, setDeletedObjectId] = useState(null);
    const [objects, setObjects] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
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
        deposit_type: {
            type: 'select',
            select: true,
            label: 'Type',
            required: true,
            options: typeOptions
        },
        owner: {
            type: 'select',
            select: true,
            label: 'Owner',
            required: false,
            options: ownerOptions
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
        },
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
                setAlert({ type: 'error', message: "Failed to load Deposits." });
            }
        }
        if (!contextBudgetId) {
            return
        }
        loadData();
    }, [contextBudgetId, refreshTimestamp, updatedObjectId, deletedObjectId]);

    /**
     * Fetches select options for Deposit.owner field from API.
     */
    useEffect(() => {
        const loadOwnerOptions = async () => {
            try {
                const ownerResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/members/`)
                setOwnerOptions([{ value: -1, label: '🏦 Common' }, ...ownerResponse]);
                const typeResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/entities/deposit_types/`)
                setTypeOptions(typeResponse.results);
            } catch (err) {
                setAlert({ type: 'error', message: "Failed to load select fields data." });
            }
        }
        if (!contextBudgetId) {
            return
        }
        loadOwnerOptions();
    }, [contextBudgetId]);

    return (
        <Paper elevation={24} sx={{
            padding: 2, bgColor: "#F1F1F1"
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                <Typography variant="h4"
                    sx={{ display: 'block', color: '#BD0000' }}>Deposits</Typography>
                <CreateButton fields={createFields} apiUrl={apiUrl} objectType={"Deposit"} />
            </Stack>
            <Divider />
            <Box sx={{ display: "flex", flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {objects.map(object => (
                    <Box key={object.id} sx={{ width: 330, m: 1 }}>
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