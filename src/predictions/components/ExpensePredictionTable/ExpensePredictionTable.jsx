import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import React from 'react';
import DraftPeriodPredictionRow from './DraftPeriodPredictionRow';
import PeriodStatuses from '../../../budgets/utils/PeriodStatuses';
import DraftPeriodPredictionHeader from './DraftPeriodPredictionHeader';
import ActivePeriodPredictionHeader from './ActivePeriodPredictionHeader';
import ActivePeriodPredictionRow from './ActivePeriodPredictionRow';
import ClosedPeriodPredictionHeader from './ClosedPeriodPredictionHeader';
import ClosedPeriodPredictionRow from './ClosedPeriodPredictionRow';


export default function ExpensePredictionTable({ predictions, periodStatus }) {
    let header = null
    let rows = null

    switch (periodStatus) {
        case PeriodStatuses.DRAFT: {
            header = <DraftPeriodPredictionHeader />
            rows = predictions.map((row) => (
                <DraftPeriodPredictionRow key={row.id} row={row} />
            ))
            break;
        }
        case PeriodStatuses.ACTIVE: {
            header = <ActivePeriodPredictionHeader />
            rows = predictions.map((row) => (
                <ActivePeriodPredictionRow key={row.id} row={row} />
            ))
            break;
        }
        case PeriodStatuses.CLOSED: {
            header = <ClosedPeriodPredictionHeader />
            rows = predictions.map((row) => (
                <ClosedPeriodPredictionRow key={row.id} row={row} />
            ))
            break;
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    {header}
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
        </TableContainer>
    );
}