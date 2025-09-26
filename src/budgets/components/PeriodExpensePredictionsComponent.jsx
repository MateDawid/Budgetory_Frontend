import React, { useContext, useEffect, useState } from 'react';
import { Box, Divider, Grid, Typography } from "@mui/material";
import { BudgetContext } from '../../app_infrastructure/store/BudgetContext';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { UserPeriodResultComponent } from './UserPeriodResultComponent';

const PeriodExpensePredictionsComponent = ({ periodId }) => {
    const { contextBudgetId, refreshTimestamp } = useContext(BudgetContext);
    const [userPeriodResults, setUserPeriodResults] = useState([]);

    /**
     * Fetches ExpensePrediction objects from API.
     */
    useEffect(() => {
        async function getUsersPeriodResults() {
            const userPeriodResultsResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/user_results/${periodId}/`)
            setUserPeriodResults(userPeriodResultsResponse)
        }
        if (!contextBudgetId) {
            return
        }
        getUsersPeriodResults();
    }, [contextBudgetId, refreshTimestamp]);


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
        </Box >
    )
}

export default PeriodExpensePredictionsComponent;