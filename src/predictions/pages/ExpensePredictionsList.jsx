import React, { useContext, useEffect, useState } from 'react';
import { Alert, Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { BudgetContext } from "../../app_infrastructure/store/BudgetContext";
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import FilterField from '../../app_infrastructure/components/FilterField';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import { ExpensePredictionCardComponent } from '../components/ExpensePredictionCardComponent';
import CreateButton from '../../app_infrastructure/components/CreateButton';
import CopyPreviousPredictionsButton from '../components/CopyPreviousPredictionsButton';
import PeriodStatuses from '../../budgets/utils/PeriodStatuses';
import PeriodFilterField from '../components/PeriodFilterField';


/**
 * ExpensePredictionsList component to display list of ExpensePredictions
 */
export default function ExpensePredictionsList() {
    const { contextBudgetId, refreshTimestamp } = useContext(BudgetContext);
    const { alert, setAlert } = useContext(AlertContext);

    // Urls
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expense_predictions/`
    const copyPredictionsUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/copy_predictions_from_previous_period/`

    // Selectors choices
    const [periods, setPeriods] = useState([])
    const [categories, setCategories] = useState([]);
    const [owners, setOwners] = useState([]);
    // Filters values
    const [periodFilter, setPeriodFilter] = useState('');
    const [ownerFilter, setOwnerFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);

    const [periodStatus, setPeriodStatus] = useState(0);
    const [periodPredictions, setPeriodPredictions] = useState([]);
    // const [userPeriodResults, setUserPeriodResults] = useState([]);

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

    useEffect(() => {
        const loadPeriodsChoices = async () => {
            try {
                const response = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods/`)
                setPeriods(response);
            } catch (err) {
                setPeriods([])
            }
        }

        if (!contextBudgetId) {
            return
        }
        loadPeriodsChoices();
    }, [contextBudgetId]);

    /**
     * Fetches ExpensePrediction objects from API.
     */
    useEffect(() => {
        const getFilterModel = () => {
            const filterModel = {}
            const selectFilters = [
                { value: periodFilter, apiField: 'period' },
                { value: categoryFilter, apiField: 'category' },
                { value: ownerFilter, apiField: 'owner' }
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
        }
        // async function getUsersPeriodResults() {
        //     const userPeriodResultsResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/user_results/${periodId}/`)
        //     setUserPeriodResults(userPeriodResultsResponse)
        // }
        if (!contextBudgetId || !periodFilter) {
            setPeriodPredictions([])
            return
        }
        getPredictions();
        // getUsersPeriodResults();
    }, [contextBudgetId, refreshTimestamp, ownerFilter, categoryFilter, periodFilter]);

    /**
     * Fetches select options for ExpensePrediction owners object from API.
     */
    useEffect(() => {
        async function getOwners() {
            const ownerResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/members/`)
            setOwners([{ value: -1, label: '🏦 Common' }, ...ownerResponse]);
        }
        if (!contextBudgetId) {
            return
        }
        getOwners();
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
            const categoryResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/?category_type=2`, {}, {}, filterModel)
            setCategories(categoryResponse);
            setCategoryFilter(null)
        }
        if (!contextBudgetId) {
            return
        }
        getCategories();
    }, [contextBudgetId, ownerFilter]);


    let predictionSectionContent = (
        <Stack alignItems="center" justifyContent="space-between" spacing={1} mt={2} mb={1}>
            <Typography color='primary' fontWeight="bold">Period not selected.</Typography>
        </Stack>
    )

    // @ts-ignore
    if (periodFilter && periodPredictions.length > 0) predictionSectionContent = periodPredictions.map((prediction) => (
        <ExpensePredictionCardComponent
            key={prediction.id}
            prediction={prediction}
            periodStatus={periodStatus}
            setAlert={setAlert}
            updateFields={createFields}
        />)
    )

    else if (periodFilter && periodPredictions.length <= 0) {
        predictionSectionContent = (<Stack alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
            <Typography>No predictions found.</Typography>
            {periodStatus === PeriodStatuses.DRAFT &&
                <CreateButton fields={createFields} objectType={"Expense prediction"} apiUrl={apiUrl} customSetAlert={setAlert} customLabel={'Add new prediction'} />
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
                <PeriodFilterField
                    periodOptions={periods}
                    periodFilter={periodFilter || ''}
                    setPeriodFilter={setPeriodFilter}
                    setPeriodStatus={setPeriodStatus}
                />
            </Stack>
            <Divider />
            {alert && <Alert sx={{ marginTop: 2, whiteSpace: 'pre-wrap' }} severity={alert.type}
                onClose={() => setAlert(null)}>{alert.message}</Alert>}
            {/* Users summaries */}
            <Box sx={{ marginTop: 2 }}>
                <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>Users results</Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography>TODO</Typography>
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
                            customSetAlert={setAlert}
                            disabled={periodStatus !== PeriodStatuses.DRAFT}
                        />
                    }
                </Stack>
                <Divider sx={{ mb: 1 }} />
                {periodFilter &&
                    <Stack direction={{ sm: "column", md: "row" }} alignItems={{ sm: "flex-start", md: "center" }}
                        justifyContent="flex-start" spacing={1} mb={1} mt={1}>
                        <FilterField
                            filterValue={ownerFilter}
                            setFilterValue={setOwnerFilter}
                            options={(owners)}
                            label="Category Owner"
                            sx={{ width: { sm: "100%", md: 200 }, margin: 0 }}
                        />
                        <FilterField
                            filterValue={categoryFilter}
                            setFilterValue={setCategoryFilter}
                            options={(categories)}
                            label="Category"
                            sx={{ width: { sm: "100%", md: 200 }, margin: 0 }}
                            disabled={!ownerFilter}
                        />
                    </Stack>
                }
                {predictionSectionContent}
            </Box>
        </Paper>
    );
}