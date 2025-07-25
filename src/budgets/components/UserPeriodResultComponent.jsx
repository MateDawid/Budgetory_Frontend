import { Card, CardContent, CardHeader, Divider, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import NumericProgressWithLabel from "../../app_infrastructure/components/CustomLinearProgress/NumericProgressWithLabel";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

/**
 * Component to display User results of predicted Expenses. 
 */
export const UserPeriodResultComponent = () => {

    const predictionsSum = 10000;
    const expensesResult = 6000;
    const balanceForPeriod = 10000;
    const username = 'User'

    return (
        <Card variant="outlined" sx={{
            marginTop: 2,
            marginRight: 2,
            borderColor: "#D0D0D0",
            width: 320,
            '& .MuiCardContent-root:last-child': {
                padding: 1,
            }
        }}>
            <Tooltip title={username} placement="top">
                <CardHeader
                    title={username}
                    slotProps={{
                        title: {
                            noWrap: true,
                            sx: {
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 290,
                                textAlign: 'center',
                            }
                        }
                    }} />
            </Tooltip>
            <Divider sx={{ width: "100%" }} />
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1} mb={1}>
                    <Typography fontSize={16} color="secondary">Funds used for Expense Predictions</Typography>
                    <Tooltip title="Total Expense Predictions compared to available funds for Period." placement="top">
                        <HelpOutlineIcon />
                    </Tooltip>
                </Stack>
                <NumericProgressWithLabel currentValue={predictionsSum} maxValue={balanceForPeriod} withCurrency />
                <Divider sx={{ width: "100%", mb: 1, mt: 1 }} />
                <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1} mb={1}>
                    <Typography fontSize={16} color="secondary">Period Expenses</Typography>
                    <Tooltip title="Total Expenses compared to sum of Expense Predictions for Period." placement="top">
                        <HelpOutlineIcon />
                    </Tooltip>
                </Stack>
                <NumericProgressWithLabel currentValue={expensesResult} maxValue={predictionsSum} withCurrency />
            </CardContent>
        </Card >
    )
}