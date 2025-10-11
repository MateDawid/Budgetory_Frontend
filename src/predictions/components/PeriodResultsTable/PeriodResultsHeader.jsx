import { TableRow, TableCell } from "@mui/material";
import React from "react";

export default function PeriodResultsHeader() {
    return (
        <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }} align='center'>User</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align='center'>Period&nbsp;Predictions</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align='center'>Period&nbsp;Expenses</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align='center'>Period&nbsp;Balance</TableCell>
        </TableRow>
    );
}
