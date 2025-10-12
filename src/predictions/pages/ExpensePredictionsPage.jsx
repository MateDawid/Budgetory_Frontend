import React, { useContext, useEffect, useState } from 'react';
import { Alert, Box, Chip, CircularProgress, Divider, Paper, Stack, Typography } from "@mui/material";
import { BudgetContext } from "../../app_infrastructure/store/BudgetContext";
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import FilterField from '../../app_infrastructure/components/FilterField';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import CreateButton from '../../app_infrastructure/components/CreateButton';
import CopyPreviousPredictionsButton from '../components/CopyPreviousPredictionsButton';
import PeriodStatuses from '../../budgets/utils/PeriodStatuses';
import PeriodFilterField from '../components/PeriodFilterField';
import ExpensePredictionTable from '../components/ExpensePredictionTable/ExpensePredictionTable';
import PeriodResultsTable from '../components/PeriodResultsTable/PeriodResultsTable';

const baseOrderingOptions = [
    { value: 'category__name', label: 'Category name ↗' },
    { value: '-category__name', label: 'Category name ↘' },
    { value: 'category__priority', label: 'Category priority ↗' },
    { value: '-category__priority', label: 'Category priority ↘' },
    { value: 'current_plan', label: 'Current plan ↗' },
    { value: '-current_plan', label: 'Current plan ↘' },
    { value: 'current_result', label: 'Current result ↗' },
    { value: '-current_result', label: 'Current result ↘' },
    { value: 'current_funds_left', label: 'Funds left ↗' },
    { value: '-current_funds_left', label: 'Funds left ↘' },
    { value: 'current_progress', label: 'Progress ↗' },
    { value: '-current_progress', label: 'Progress ↘' },
]

const draftPeriodOrderingOptions = [
    { value: 'previous_result', label: 'Previous result ↗' },
    { value: '-previous_result', label: 'Previous result ↘' },
    { value: 'previous_funds_left', label: 'Previous funds left ↗' },
    { value: '-previous_funds_left', label: 'Previous funds left ↘' },
]

/**
 * ExpensePredictionsPage component to display list of ExpensePredictions
 */
export default function ExpensePredictionsPage() {
    const { contextBudgetId, refreshTimestamp } = useContext(BudgetContext);
    const { alert, setAlert } = useContext(AlertContext);
    const [periodResultsLoading, setPeriodResultsLoading] = useState(false);
    const [predictionsLoading, setPredictionsLoading] = useState(false);

    // Urls
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expense_predictions/`
    const copyPredictionsUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/copy_predictions_from_previous_period/`

    // Selectors choices
    const [periods, setPeriods] = useState([]);
    const [owners, setOwners] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [categories, setCategories] = useState([]);
    const [progressStatuses, setProgressStatuses] = useState([]);

    // Filters values
    const [periodFilter, setPeriodFilter] = useState('');
    const [ownerFilter, setOwnerFilter] = useState(null);
    const [priorityFilter, setPriorityFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [progressStatusFilter, setProgressStatusFilter] = useState(null);
    const [orderingFilter, setOrderingFilter] = useState(null);

    // Data
    const [periodStatus, setPeriodStatus] = useState(0);
    const [periodStatusLabel, setPeriodStatusLabel] = useState(null);
    const [periodPredictions, setPeriodPredictions] = useState([]);
    const [periodResults, setPeriodResults] = useState([]);

    const createFields = {
        period: {
            prefixedValue: periodFilter
        },
        category: {
            type: 'select',
            select: true,
            label: 'Category',
            required: true,
            options: categories
        },
        current_plan: {
            type: 'number',
            step: "any",
            label: 'Value',
            required: true,
            slotProps: {
                htmlInput: {
                    step: 0.01,
                    min: 0
                }
            }
        },
        description: {
            type: 'string',
            label: 'Description',
            required: false,
            multiline: true,
            rows: 4
        }
    }

    /**
     * Fetches select options for ExpensePrediction select fields from API.
     */
    useEffect(() => {
        async function getPeriodsChoices() {
            try {
                const response = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods/`)
                setPeriods(response);
            } catch (err) {
                setPeriods([])
            }
        }

        async function getOwners() {
            const ownerResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/members/`)
            setOwners([{ value: -1, label: '🏦 Common' }, ...ownerResponse]);
        }

        async function getPriorities() {
            const priorityResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/categories/priorities/?type=2`)
            setPriorities(priorityResponse.results);
        }

        async function getProgressStatuses() {
            const progressStatusResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/predictions/progress_statuses/`)
            setProgressStatuses(progressStatusResponse);
        }

        if (!contextBudgetId) {
            return
        }
        getPeriodsChoices();
        getOwners();
        getPriorities();
        getProgressStatuses();
    }, [contextBudgetId]);

    /**
     * Fetches select options for ExpensePrediction categories object from API.
     */
    useEffect(() => {
        async function getCategories() {
            const filterModel = {}
            if (ownerFilter) {
                filterModel['owner'] = ownerFilter
            }
            if (priorityFilter) {
                filterModel['priority'] = priorityFilter
            }
            const categoryResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/?category_type=2`, {}, {}, filterModel)
            setCategories(categoryResponse);
            setCategoryFilter(null)
        }
        if (!contextBudgetId) {
            return
        }
        getCategories();
    }, [contextBudgetId, ownerFilter, priorityFilter]);

    /**
     * Fetches Period results from API.
     */
    useEffect(() => {
        async function getPeriodResults() {
            const userPeriodResultsResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/user_results/${periodFilter}/`)
            setPeriodResults(userPeriodResultsResponse)
            setPeriodResultsLoading(false)
        }
        if (!contextBudgetId || !periodFilter) {
            return
        }
        setPeriodResultsLoading(true)
        getPeriodResults();
    }, [contextBudgetId, periodFilter]);

    /**
     * Fetches ExpensePrediction objects from API.
     */
    useEffect(() => {
        const getFilterModel = () => {
            const filterModel = {}
            const selectFilters = [
                { value: periodFilter, apiField: 'period' },
                { value: categoryFilter, apiField: 'category' },
                { value: ownerFilter, apiField: 'owner' },
                { value: progressStatusFilter, apiField: 'progress_status' },
                { value: priorityFilter, apiField: 'category_priority' },
                { value: orderingFilter, apiField: 'ordering' }
            ]
            selectFilters.forEach(object => {
                if (object.value !== null) {
                    filterModel[[object.apiField]] = object.value
                }
            })

            return filterModel
        }
        async function getPredictions() {
            const predictionsResponse = await getApiObjectsList(apiUrl, {}, {}, getFilterModel())
            setPeriodPredictions(predictionsResponse);
            setPredictionsLoading(false);
        }
        if (!contextBudgetId || !periodFilter) {
            setPeriodPredictions([])
            return
        }
        setPredictionsLoading(true);
        getPredictions();
    }, [contextBudgetId, refreshTimestamp, ownerFilter, priorityFilter, categoryFilter, periodFilter, progressStatusFilter, orderingFilter]);

    // Period results section establishing 

    let periodResultsSectionContent = (
        <Stack alignItems="center" justifyContent="space-between" spacing={1} mt={2} mb={1}>
            <Typography color='primary' fontWeight="bold">Period not selected.</Typography>
        </Stack>
    )

    if (periodResultsLoading) {
        periodResultsSectionContent = <Box display="flex" justifyContent="center"><CircularProgress size="3rem" /></Box>

    }

    else if (periodFilter && periodResults.length > 0) {
        periodResultsSectionContent = <PeriodResultsTable results={periodResults}/>
    }       

    else if (periodFilter && periodResults.length <= 0) {
        periodResultsSectionContent = (
        <Stack alignItems="center" justifyContent="space-between" spacing={1} mt={2} mb={1}>
            <Typography color='primary' fontWeight="bold">No Period results to display.</Typography>
        </Stack>
    )
    } 

    // Prediction section establishing 
    let predictionSectionContent = (
        <Stack alignItems="center" justifyContent="space-between" spacing={1} mt={2} mb={1}>
            <Typography color='primary' fontWeight="bold">Period not selected.</Typography>
        </Stack>
    )
    if (predictionsLoading) {
        predictionSectionContent = <Box display="flex" justifyContent="center"><CircularProgress size="3rem" /></Box>
    }
    
    // @ts-ignore
    else if (periodFilter && periodPredictions.length > 0) {
        predictionSectionContent = <ExpensePredictionTable predictions={periodPredictions} periodStatus={periodStatus} />
    }
    else if (periodFilter && periodPredictions.length <= 0) {
        predictionSectionContent = (<Stack alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
            <Typography color='primary' fontWeight="bold">No predictions found.</Typography>
            {periodStatus === PeriodStatuses.DRAFT &&
                <CreateButton
                    fields={createFields}
                    objectType={"Expense prediction"}
                    apiUrl={apiUrl}
                    customLabel={'Add new Prediction'}
                />
            }
            {(periodStatus === PeriodStatuses.DRAFT && periods.length > 1 && !categoryFilter && !ownerFilter) &&
                <CopyPreviousPredictionsButton periodId={periodFilter} apiUrl={copyPredictionsUrl} setAlert={setAlert} />
            }
        </Stack>)
    }

    return (
        <Paper elevation={24} sx={{
            padding: 2, bgColor: "#F1F1F1"
        }}>
            {/* Main header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                <Typography variant="h4"
                    sx={{ display: 'block', color: '#BD0000' }}>Expenses Predictions in Period</Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    {periodStatusLabel && <Chip label={periodStatusLabel} variant="outlined" />}
                    <PeriodFilterField
                        periodOptions={periods}
                        periodFilter={periodFilter || ''}
                        setPeriodFilter={setPeriodFilter}
                        setPeriodStatus={setPeriodStatus}
                        setPeriodStatusLabel={setPeriodStatusLabel}
                    />
                </Stack>
            </Stack>
            <Divider />
            {alert && <Alert sx={{ marginTop: 2, whiteSpace: 'pre-wrap' }} severity={alert.type}
                onClose={() => setAlert(null)}>{alert.message}</Alert>}
            {/* Users summaries */}
            <Box sx={{ marginTop: 2 }}>
                <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>Period results</Typography>
                <Divider sx={{ mb: 1 }} />
                {periodResultsSectionContent}
            </Box>
            {/* Predictions objects */}
            <Box sx={{ marginTop: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mt={2} mb={1}>
                    <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>Predictions</Typography>
                    {periodPredictions.length > 0 &&
                        <CreateButton
                            fields={createFields}
                            objectType={"Expense prediction"}
                            apiUrl={apiUrl}
                            disabled={periodStatus !== PeriodStatuses.DRAFT}
                        />
                    }
                </Stack>
                <Divider sx={{ mb: 1 }} />
                {(periodFilter && !predictionsLoading) &&
                    <Stack direction={{ sm: "column", md: "row" }} alignItems={{ sm: "flex-start", md: "center" }}
                        justifyContent="flex-start" spacing={1} mb={1} mt={1}>
                        <FilterField
                            filterValue={ownerFilter}
                            setFilterValue={setOwnerFilter}
                            options={owners}
                            label="Category Owner"
                            sx={{ width: { sm: "100%", md: 200 }, margin: 0 }}
                        />
                        <FilterField
                            filterValue={priorityFilter}
                            setFilterValue={setPriorityFilter}
                            options={priorities}
                            label="Category Priority"
                            sx={{ width: { sm: "100%", md: 200 }, margin: 0 }}
                        />
                        <FilterField
                            filterValue={categoryFilter}
                            setFilterValue={setCategoryFilter}
                            options={categories}
                            label="Category"
                            sx={{ width: { sm: "100%", md: 200 }, margin: 0 }}
                            disabled={!ownerFilter}
                            groupBy={(option) => option.priority_display}
                            renderGroup={(params) => (
                                <li key={params.key}>
                                    <div style={{
                                        fontWeight: "400",
                                        fontSize: "14px",
                                        padding: "8px 16px",
                                        color: "rgba(0, 0, 0, 0.6)",
                                    }}>
                                        {params.group}
                                    </div>
                                    <ul style={{ padding: 0 }}>{params.children}</ul>
                                </li>
                            )}

                        />
                        <FilterField
                            filterValue={progressStatusFilter}
                            setFilterValue={setProgressStatusFilter}
                            options={progressStatuses}
                            label="Progress"
                            sx={{ width: { sm: "100%", md: 200 }, margin: 0 }}
                        />
                        <FilterField
                            filterValue={orderingFilter}
                            setFilterValue={setOrderingFilter}
                            options={periodStatus === PeriodStatuses.DRAFT ? [...baseOrderingOptions, ...draftPeriodOrderingOptions] : baseOrderingOptions}
                            label="Sort by"
                            sx={{ width: { sm: "100%", md: 200 }, margin: 0 }}
                        />
                    </Stack>
                }
                {predictionSectionContent}
            </Box>
        </Paper >
    );
}