import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import React from 'react';
import PeriodResultsHeader from './PeriodResultsHeader';
import PeriodResultsRow from './PeriodResultsRow';

export default function PeriodResultsTable({ results }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <PeriodResultsHeader />
        </TableHead>
        <TableBody>
          {results.map((row) => (
            <PeriodResultsRow key={row.user_username} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
