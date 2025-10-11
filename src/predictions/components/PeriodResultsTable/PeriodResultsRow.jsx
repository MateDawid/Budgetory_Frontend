import { TableRow, TableCell } from "@mui/material";
import React, { useContext } from "react";
import { BudgetContext } from "../../../app_infrastructure/store/BudgetContext";
import { getFontColor } from "../utils";

/**
 * DraftPeriodPredictionRow component to display ExpensePrediction data row with data suitable for CLOSED Period.
 * @param {object} props
 * @param {object} props.row - Table row object.
 */
export default function PeriodResultsRow({ row }) {
    const { contextBudgetCurrency } = useContext(BudgetContext);

    const fontColor = getFontColor(row.period_expenses, row.predictions_sum);

    return (
        <TableRow>
            <TableCell align='center'>{row.user_username}</TableCell>
            <TableCell align='center'>{row.predictions_sum}{`\u00A0${contextBudgetCurrency}`}</TableCell>
            <TableCell align='center'>{row.period_expenses}{`\u00A0${contextBudgetCurrency}`}</TableCell>
            <TableCell align='center' sx={{ color: fontColor }}>{row.period_balance}{`\u00A0${contextBudgetCurrency}`}</TableCell>
        </TableRow>
    );
}
