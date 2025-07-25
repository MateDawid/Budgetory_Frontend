import React, { useContext, useEffect, useState } from 'react';
import { Alert, Box, Stack, Typography } from "@mui/material";
import CreateButton from '../../app_infrastructure/components/CreateButton';
import { BudgetContext } from '../../app_infrastructure/store/BudgetContext';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { ExpensePredictionCardComponent } from './ExpensePredictionCardComponent';
import PeriodStatuses from '../utils/PeriodStatuses';
import { UserPeriodResultComponent } from './UserPeriodResultComponent';

const PeriodExpensePredictionsComponent = ({ periodId, periodStatus }) => {
    /*
    - Draft status - adding, deleting and edititng Expense Predictions
    - Active status - changing current value of Prediction
    - Closed status - no changes possible 

    - Possibility to copy all predictions from previous period
    */
    const { contextBudgetId, objectChange } = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expense_predictions/?period=${periodId}`
    const [categoryOptions, setCategoryOptions] = useState([]);
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
     * Fetches select options for ExpensePrediction object from API.
     */
    useEffect(() => {
        async function getPredictions() {
            const predictionsResponse = await getApiObjectsList(apiUrl)
            setPeriodPredictions(predictionsResponse);
        }
        async function getUsersPeriodResults() {
            // TODO - API call
            setUserPeriodResults([
                {
                    user_id: '1',
                    user_username: 'username1',
                    period_id: '?',
                    predictions_sum: 100,
                    period_balance: 110,
                    period_expenses: 90,
                },
                {
                    user_id: '2',
                    user_username: 'username2',
                    period_id: '?',
                    predictions_sum: 100,
                    period_balance: 90,
                    period_expenses: 110,
                },
                {
                    user_id: '3',
                    user_username: 'username2',
                    period_id: '?',
                    predictions_sum: 200,
                    period_balance: 90,
                    period_expenses: 450,
                },
                                {
                    user_id: '4',
                    user_username: 'username2',
                    period_id: '?',
                    predictions_sum: 0,
                    period_balance: 0,
                    period_expenses: 0,
                },
                                                {
                    user_id: '5',
                    user_username: 'username2',
                    period_id: '?',
                    predictions_sum: 1000,
                    period_balance: 1000,
                    period_expenses: 1000,
                },
                                                {
                    user_id: '6',
                    user_username: 'username2',
                    period_id: '?',
                    predictions_sum: 10000,
                    period_balance: 10000,
                    period_expenses: 10000,
                },
            ]);
        }
        getPredictions();
        getUsersPeriodResults();
    }, [contextBudgetId, objectChange]);

    /**
     * Fetches select options for ExpensePrediction object from API.
     */
    useEffect(() => {
        async function getCategories() {
            const categoryResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/?category_type=2`)
            setCategoryOptions(categoryResponse);
        }
        getCategories();
    }, [contextBudgetId]);


    return (
        <Box sx={{ marginTop: 2 }}>
            {/* Users results*/}
            {userPeriodResults.length > 0 && <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>Users results</Typography>}
            <Box sx={{ display: "flex", flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {userPeriodResults.map((userPeriodResult) => (
                    <UserPeriodResultComponent
                        key={userPeriodResult.user_id}
                        userPeriodResult={userPeriodResult}
                    />)
                )}
            </Box>
            {/* Expense predictions */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mt={2}>
                <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>Expense predictions</Typography>
                <CreateButton fields={createFields} objectType={"Expense prediction"} apiUrl={apiUrl} customSetAlert={setAlert} disabled={periodStatus !== PeriodStatuses.DRAFT} />
            </Stack>
            {alert &&
                <Alert
                    sx={{ marginTop: 2, whiteSpace: 'pre-wrap' }}
                    severity={alert.type}
                    onClose={() => setAlert(null)}
                >
                    {alert.message}
                </Alert>}
            {/* Filters and sorters */}
            {/* TODO */}
            {periodPredictions.map((prediction) => (
                <ExpensePredictionCardComponent
                    key={prediction.id}
                    prediction={prediction}
                    periodStatus={periodStatus}
                    setAlert={setAlert}
                    updateFields={createFields}
                />)
            )}
        </Box >
    )
}

export default PeriodExpensePredictionsComponent;