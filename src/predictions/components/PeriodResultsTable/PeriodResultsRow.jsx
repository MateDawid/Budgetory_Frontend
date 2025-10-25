import { TableRow, TableCell, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import { BudgetContext } from "../../../app_infrastructure/store/BudgetContext";
import { getFontColor } from "../utils";
import ColouredLinearProgress from "../../../app_infrastructure/components/CustomLinearProgress/ColouredLinearProgress";

/**
 * PeriodResultsRow component to display results of Predictions realization for specified Period.
 * @param {object} props
 * @param {object} props.row - Table row object.
 */
export default function PeriodResultsRow({ row }) {
    const { contextBudgetCurrency } = useContext(BudgetContext);

    const predictionsFont = getFontColor(row.predictions_sum, row.period_balance)
    const expensesFont = getFontColor(row.period_expenses, row.predictions_sum)

    return (
        <TableRow>
            <TableCell align='center'>{row.deposit_name}</TableCell>
            <TableCell align='center'>
                <Stack gap={1} sx={{
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Typography variant="body2" color={predictionsFont}>
                        {row.predictions_sum}&nbsp;{contextBudgetCurrency} / {row.period_balance}&nbsp;{contextBudgetCurrency}
                    </Typography>
                    <ColouredLinearProgress currentValue={row.predictions_sum} maxValue={row.period_balance} />
                </Stack>
            </TableCell>
            <TableCell align='center' sx={{ color: predictionsFont, fontWeight: 'bold' }}>{row.funds_left_for_predictions}&nbsp;{contextBudgetCurrency}</TableCell>
            <TableCell align='center'>
                <Stack gap={1} sx={{
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Typography variant="body2" color={expensesFont}>
                        {row.period_expenses}&nbsp;{contextBudgetCurrency} / {row.predictions_sum}&nbsp;{contextBudgetCurrency}
                    </Typography>
                    <ColouredLinearProgress currentValue={row.period_expenses} maxValue={row.predictions_sum} />
                </Stack>
            </TableCell>
            <TableCell align='center' sx={{ color: expensesFont, fontWeight: 'bold' }}>{row.funds_left_for_expenses}&nbsp;{contextBudgetCurrency}</TableCell>
        </TableRow>
    );
}
