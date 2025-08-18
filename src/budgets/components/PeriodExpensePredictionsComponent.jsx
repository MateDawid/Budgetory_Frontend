import React, { useContext, useEffect, useState } from 'react';
import { Alert, Box, Stack, Typography } from "@mui/material";
import CreateButton from '../../app_infrastructure/components/CreateButton';
import { BudgetContext } from '../../app_infrastructure/store/BudgetContext';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { ExpensePredictionCardComponent } from './ExpensePredictionCardComponent';
import PeriodStatuses from '../utils/PeriodStatuses';
import { UserPeriodResultComponent } from './UserPeriodResultComponent';
import CopyPreviousPredictionsButton from './CopyPreviousPredictionsButton';

const PeriodExpensePredictionsComponent = ({ periodId, periodStatus }) => {
    /*
    - Draft status - adding, deleting and edititng Expense Predictions
    - Active status - changing current value of Prediction
    - Closed status - no changes possible 

    - Possibility to copy all predictions from previous period
    */
    const { contextBudgetId, objectChange } = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expense_predictions/?period=${periodId}`
    const copyPredictionsUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expense_predictions/copy_from_previous_period/`
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
            const userPeriodResultsResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/user_results/${periodId}/`)
            setUserPeriodResults(userPeriodResultsResponse)
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
                {periodStatus === PeriodStatuses.DRAFT &&
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={1}>
                        <CreateButton fields={createFields} objectType={"Expense prediction"} apiUrl={apiUrl} customSetAlert={setAlert} disabled={periodStatus !== PeriodStatuses.DRAFT} />
                        {periodPredictions.length <= 0 && <CopyPreviousPredictionsButton periodId={periodId} apiUrl={copyPredictionsUrl} />}
                    </Stack>
                }
            </Stack>
            {alert &&
                <Alert
                    sx={{ marginTop: 2, whiteSpace: 'pre-wrap' }}
                    severity={alert.type}
                    onClose={() => setAlert(null)}
                >
                    {alert.message}
                </Alert>
            }
            {periodPredictions.length <= 0 
            && <Typography variant="body1" sx={{ marginTop: 2, color: '#3E3E3E' }}>No Predictions created yet.</Typography>}
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