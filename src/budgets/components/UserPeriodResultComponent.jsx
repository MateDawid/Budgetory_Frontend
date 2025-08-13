import { Box, Card, CardContent, CardHeader, Divider, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import NumericProgressWithLabel from "../../app_infrastructure/components/CustomLinearProgress/NumericProgressWithLabel";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

/**
 * Component to display User results of predicted Expenses. 
 */
export const UserPeriodResultComponent = ({ userPeriodResult }) => {
    return (
        <Card variant="outlined" sx={{
            marginTop: 2,
            marginRight: 2,
            borderColor: "#D0D0D0",
            width: 440,
            '& .MuiCardContent-root:last-child': {
                padding: 1,
            }
        }}>
            <Tooltip title={userPeriodResult.user_username} placement="top">
                <CardHeader
                    title={userPeriodResult.user_username}
                    slotProps={{
                        title: {
                            noWrap: true,
                            sx: {
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 400,
                                textAlign: 'center',
                            }
                        }
                    }}
                    sx={{background: '#F1F1F1'}} />
            </Tooltip>
            <Divider sx={{ width: "100%" }} />
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={1}>
                    <Tooltip title="Total Expense Predictions compared to available funds for Period." placement="top">
                        <HelpOutlineIcon />
                    </Tooltip>
                    <Typography fontSize={16} fontWeight="bold" color="secondary">Planned expenses</Typography>
                </Stack>
                <Box margin="0 auto" width="90%">
                    <NumericProgressWithLabel currentValue={userPeriodResult.predictions_sum} maxValue={userPeriodResult.period_balance} withCurrency />
                </Box>
                <Divider sx={{ width: "100%", mb: 1, mt: 1 }} />
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={1}>
                    <Tooltip title="Total Expenses compared to sum of Expense Predictions for Period." placement="top">
                        <HelpOutlineIcon />
                    </Tooltip>
                    <Typography fontSize={16} fontWeight="bold" color="secondary">Period expenses</Typography>
                </Stack>
                <Box margin="0 auto" width="90%">
                    <NumericProgressWithLabel currentValue={userPeriodResult.period_expenses} maxValue={userPeriodResult.predictions_sum} withCurrency />
                </Box>
            </CardContent>
        </Card >
    )
}