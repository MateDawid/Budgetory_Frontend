import React, { useContext, useEffect, useState } from 'react';
import { Alert, Box, Stack, Typography } from "@mui/material";
import CreateButton from '../../app_infrastructure/components/CreateButton';
import { BudgetContext } from '../../app_infrastructure/components/BudgetContext';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { ExpensePredictionCardComponent } from './ExpensePredictionCardComponent';

const PeriodExpensePredictionsComponent = ({ periodId, periodStatus }) => {
    /*
    - Draft status - adding, deleting and edititng Expense Predictions
    - Active status - changing current value of Prediction
    - Closed status - no changes possible 

    - Possibility to copy all predictions from previous period
    */
    const { contextBudgetId } = useContext(BudgetContext);
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expense_predictions/?period=${periodId}`
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [periodPredictions, setPeriodPredictions] = useState([]);
    const [updatedObject, setUpdatedObject] = useState();
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
        current_value: {
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
        getPredictions();
    }, [contextBudgetId, updatedObject]);

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
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>Expense predictions</Typography>
                <CreateButton fields={createFields} apiUrl={apiUrl} setAddedObjectId={setUpdatedObject} customSetAlert={setAlert} />
            </Stack>
            {alert &&
                <Alert
                    sx={{ marginTop: 2, whiteSpace: 'pre-wrap' }}
                    severity={alert.type}
                    onClose={() => setAlert(null)}
                >
                    {alert.message}
                </Alert>}
            {/* TOTAL SPENT, TOTAL PLANNED, WHAT'S LEFT*/}
            {/* FILTERS AND SORTERS */}
            {periodPredictions.map((prediction) => (
                <ExpensePredictionCardComponent
                    key={prediction.id}
                    prediction={prediction}
                    periodStatus={periodStatus}
                    setUpdatedObject={setUpdatedObject}
                    setAlert={setAlert}
                />)
            )}
        </Box >
    )
}

export default PeriodExpensePredictionsComponent;