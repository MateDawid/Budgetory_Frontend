import React, { useContext, useEffect, useState } from 'react';
import Typography from "@mui/material/Typography";
import { Box, Paper, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import Alert from '@mui/material/Alert';
import { AlertContext } from "../../app_infrastructure/store/AlertContext";
import { BudgetContext } from "../../app_infrastructure/store/BudgetContext";
import { getApiObjectsList } from "../../app_infrastructure/services/APIService";
import TransferCategoryCard from "../components/TransferCategoryCard";
import CreateButton from "../../app_infrastructure/components/CreateButton";
import loadSelectOptionForCategory from "../utils/loadSelectOptionForCategory";
import FilterField from "../../app_infrastructure/components/FilterField";
import SearchField from "../../app_infrastructure/components/SearchField";


/**
 * TransferCategoryList component to display list of Budget TransferCategories.
 */
export default function TransferCategoryList() {
    const { contextBudgetId, refreshTimestamp } = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/`

    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState(null);
    const [priorityFilter, setPriorityFilter] = useState(null);
    const [depositFilter, setDepositFilter] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);

    const { alert, setAlert } = useContext(AlertContext);
    const [updatedObjectId, setUpdatedObjectId] = useState(null);
    const [deletedObjectId, setDeletedObjectId] = useState(null);
    const [objects, setObjects] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);
    const [priorityOptions, setPriorityOptions] = useState([]);
    const [depositOptions, setDepositOptions] = useState([]);
    const activeOptions = [
        {
            value: true,
            label: '🟢 Active',
        },
        {
            value: false,
            label: '🔴 Inactive',
        }
    ]

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
        deposit: {
            type: 'select',
            select: true,
            label: 'Deposit',
            required: true,
            options: depositOptions
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
            options: activeOptions
        }
    }

    /**
     * Fetches TransferCategories list from API.
     */
    useEffect(() => {
        const getFilterModel = () => {
            const filterModel = {}
            // Text input
            if (searchQuery !== "") {
                filterModel["name"] = searchQuery
            }
            // Select inputs
            const selectFilters = [
                { value: typeFilter, apiField: 'category_type' },
                { value: priorityFilter, apiField: 'priority' },
                { value: depositFilter, apiField: 'deposit' },
                { value: activeFilter, apiField: 'is_active' }
            ]
            selectFilters.forEach(object => {
                if (object.value !== null) {
                    filterModel[[object.apiField]] = object.value
                }
            })

            return filterModel
        }
        const loadData = async () => {
            try {
                const listResponse = await getApiObjectsList(apiUrl, {}, {}, getFilterModel())
                setObjects(listResponse);
            } catch (err) {
                setAlert({ type: 'error', message: "Failed to load Categories." });
            }
        }
        if (!contextBudgetId) {
            return
        }
        loadData();
    }, [contextBudgetId, refreshTimestamp, updatedObjectId, deletedObjectId, searchQuery, typeFilter, priorityFilter, depositFilter, activeFilter]);

    /**
     * Fetches select options for TransferCategory object from API.
     */
    useEffect(() => {
        if (!contextBudgetId) {
            return
        }
        loadSelectOptionForCategory(contextBudgetId, setTypeOptions, setPriorityOptions, setDepositOptions, setAlert);
    }, [contextBudgetId]);

    return (
        <Paper elevation={24} sx={{
            padding: 2, bgColor: "#F1F1F1"
        }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                <Typography variant="h4"
                    sx={{ display: 'block', color: '#BD0000' }}>Transfer Categories</Typography>
                <CreateButton fields={createFields} apiUrl={apiUrl} objectType={"Transfer Category"} />
            </Stack>
            <Divider sx={{ mb: 1 }} />
            {alert && <Alert sx={{ mb: 1, whiteSpace: 'pre-wrap' }} severity={alert.type}
                onClose={() => setAlert(null)}>{alert.message}</Alert>}
            <SearchField setSearchQuery={setSearchQuery} label="Search" sx={{ width: "100%", marginBottom: 1 }} />
            <Stack direction={{ sm: "column", md: "row" }} alignItems={{ sm: "flex-start", md: "center" }}
                justifyContent="flex-start" spacing={1} mb={1}>
                <FilterField filterValue={typeFilter} setFilterValue={setTypeFilter} options={typeOptions} label="Type"
                    sx={{ width: { sm: "100%", md: 200 }, margin: 0 }} />
                <FilterField filterValue={priorityFilter} setFilterValue={setPriorityFilter} options={priorityOptions} label="Priority"
                    sx={{ width: { sm: "100%", md: 200 }, margin: 0 }} />
                <FilterField filterValue={depositFilter} setFilterValue={setDepositFilter} options={depositOptions} label="Deposit"
                    sx={{ width: { sm: "100%", md: 200 }, margin: 0 }} />
                <FilterField filterValue={activeFilter} setFilterValue={setActiveFilter} options={activeOptions} label="Active"
                    sx={{ width: { sm: "100%", md: 200 }, margin: 0 }} />
            </Stack>
            <Divider sx={{ mt: 1 }} />

            <Box sx={{ display: "flex", flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {objects.length === 0 ?
                    <Typography variant="h5" sx={{ display: 'block', color: '#BD0000', mt: 2 }}>No Categories
                        found.</Typography> : (
                        objects.map(object => (
                            <Box key={object.id} sx={{ width: 330, m: 1 }}>
                                <TransferCategoryCard
                                    apiUrl={apiUrl}
                                    object={object}
                                    setUpdatedObjectId={setUpdatedObjectId}
                                    setDeletedObjectId={setDeletedObjectId}
                                />
                            </Box>
                        ))
                    )}
            </Box>

        </Paper>
    );
}