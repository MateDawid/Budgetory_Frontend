import { TableRow, TableCell } from "@mui/material";
import React from "react";

export default function DraftPeriodPredictionHeader() {
    return (
        <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }} align='center'>Category&nbsp;owner</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align='center'>Category</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align='center'>Current&nbsp;result</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align='center'>Funds&nbsp;left</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align='center'>Progress</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align='center'>Actions</TableCell>
        </TableRow>
    );
}
