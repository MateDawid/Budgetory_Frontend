import React, { useContext, useEffect, useState } from 'react';
import { Alert, Box, Divider, Grid, Stack, Typography } from "@mui/material";
import CreateButton from '../../app_infrastructure/components/CreateButton';
import { BudgetContext } from '../../app_infrastructure/store/BudgetContext';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { ExpensePredictionCardComponent } from './ExpensePredictionCardComponent';
import PeriodStatuses from '../utils/PeriodStatuses';
import { UserPeriodResultComponent } from './UserPeriodResultComponent';
import CopyPreviousPredictionsButton from './CopyPreviousPredictionsButton';
import FilterField from "../../app_infrastructure/components/FilterField";

const PeriodExpensePredictionsComponent = ({ periodId, periodStatus }) => {
    const { contextBudgetId, refreshTimestamp } = useContext(BudgetContext);
    const [ownerFilter, setOwnerFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expense_predictions/?period=${periodId}`
    const copyPredictionsUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/copy_predictions_from_previous_period/`
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [periodPredictions, setPeriodPredictions] = useState([]);
    const [userPeriodResults, setUserPeriodResults] = useState([]);
    const [alert, setAlert] = useState(null);

    const createFields = {
        period: {
            prefixedValue: periodId
        },
        category: {
            type: 'select',
            select: true,
            label: 'Category',
            required: true,
            options: categoryOptions
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
     * Fetches ExpensePrediction objects from API.
     */
    useEffect(() => {
        const getFilterModel = () => {
            const filterModel = {}
            const selectFilters = [
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
        async function getUsersPeriodResults() {
            const userPeriodResultsResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/user_results/${periodId}/`)
            setUserPeriodResults(userPeriodResultsResponse)
        }
        getPredictions();
        getUsersPeriodResults();
    }, [contextBudgetId, refreshTimestamp, ownerFilter, categoryFilter]);

    /**
     * Fetches select options for ExpensePrediction owners object from API.
     */
    useEffect(() => {
        async function getOwners() {
            const ownerResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/members/`)
            setOwnerOptions([{ value: -1, label: '🏦 Common' }, ...ownerResponse]);
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
            setCategoryOptions(categoryResponse);
            setCategoryFilter(null)
        }
        getCategories();
    }, [contextBudgetId, ownerFilter]);


    const predictionCards = periodPredictions.map((prediction) => (
        <ExpensePredictionCardComponent
            key={prediction.id}
            prediction={prediction}
            periodStatus={periodStatus}
            setAlert={setAlert}
            updateFields={createFields}
        />)
    )

    return (
        <Box sx={{ marginTop: 2 }}>
            {/* Users results*/}
            {userPeriodResults.length > 0 &&
                <>
                    <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>Users results</Typography>
                    <Divider sx={{ mb: 1 }} />
                </>
            }
            <Grid container spacing={2}>
                {userPeriodResults.map((userPeriodResult) => (
                    <UserPeriodResultComponent
                        key={userPeriodResult.user_id}
                        userPeriodResult={userPeriodResult}
                    />)
                )}
            </Grid>
            {/* Expense predictions */}
            {(periodStatus === PeriodStatuses.DRAFT || (periodPredictions.length > 0 && periodStatus !== PeriodStatuses.DRAFT)) &&
                <>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mt={2} mb={1}>
                        <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>Expense predictions</Typography>
                        {periodPredictions.length > 0 && <CreateButton fields={createFields} objectType={"Expense prediction"} apiUrl={apiUrl} customSetAlert={setAlert} disabled={periodStatus !== PeriodStatuses.DRAFT} />}
                    </Stack>
                    <Divider />
                    {alert &&
                        <Alert
                            sx={{ marginTop: 1, whiteSpace: 'pre-wrap' }}
                            severity={alert.type}
                            onClose={() => setAlert(null)}
                        >
                            {alert.message}
                        </Alert>
                    }
                    <Stack direction={{ sm: "column", md: "row" }} alignItems={{ sm: "flex-start", md: "center" }}
                        justifyContent="flex-start" spacing={1} mb={1} mt={1}>
                        <FilterField
                            filterValue={ownerFilter}
                            setFilterValue={setOwnerFilter}
                            options={(ownerOptions)}
                            label="Category Owner"
                            sx={{ width: { sm: "100%", md: 200 }, margin: 0 }}
                        />
                        <FilterField
                            filterValue={categoryFilter}
                            setFilterValue={setCategoryFilter}
                            options={(categoryOptions)}
                            label="Category"
                            sx={{ width: { sm: "100%", md: 200 }, margin: 0 }}
                            disabled={!ownerFilter}
                        />
                    </Stack>
                    <Divider sx={{ mb: 1 }} />
                    <Box>
                        {periodPredictions.length <= 0 && periodStatus === PeriodStatuses.DRAFT
                            ?
                            <>
                                <Stack alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                                    <Typography>No predictions found.</Typography>
                                    <CreateButton fields={createFields} objectType={"Expense prediction"} apiUrl={apiUrl} customSetAlert={setAlert} customLabel={'Add new prediction'} />
                                    {!ownerFilter &&
                                        <CopyPreviousPredictionsButton periodId={periodId} apiUrl={copyPredictionsUrl} setAlert={setAlert} />
                                    }

                                </Stack>
                            </>
                            : predictionCards
                        }
                    </Box>
                </>

            }
        </Box >
    )
}

export default PeriodExpensePredictionsComponent;