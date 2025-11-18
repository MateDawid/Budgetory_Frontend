import { TableRow, TableCell, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function PeriodResultsHeader() {
  return (
    <TableRow>
      <TableCell sx={{ fontWeight: 'bold' }} align="center">
        Deposit
      </TableCell>
      <TableCell align="center">
        <Stack
          direction="row"
          spacing={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body2" fontWeight="bold">
            Predicted&nbsp;Expenses
          </Typography>
          <Tooltip
            title={
              <>
                <b>Total Expense Predictions</b>
                <br />
                compared to
                <br />
                <b>Available funds for Period</b>
              </>
            }
            placement="top"
          >
            <HelpOutlineIcon />
          </Tooltip>
        </Stack>
      </TableCell>
      <TableCell align="center">
        <Stack
          direction="row"
          spacing={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body2" fontWeight="bold">
            Funds&nbsp;left&nbsp;
            <br />
            for&nbsp;Predictions
          </Typography>
          <Tooltip
            title={
              'Funds available in Period that can be used to plan Expenses in Predictions.'
            }
            placement="top"
          >
            <HelpOutlineIcon />
          </Tooltip>
        </Stack>
      </TableCell>
      <TableCell align="center">
        <Stack
          direction="row"
          spacing={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body2" fontWeight="bold">
            Actual&nbsp;Expenses
          </Typography>
          <Tooltip
            title={
              <>
                <b>Total Expenses</b>
                <br />
                compared to
                <br />
                <b>Total Expense Predictions</b>
              </>
            }
            placement="top"
          >
            <HelpOutlineIcon />
          </Tooltip>
        </Stack>
      </TableCell>
      <TableCell align="center">
        <Stack
          direction="row"
          spacing={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body2" fontWeight="bold">
            Funds&nbsp;left&nbsp;
            <br />
            for&nbsp;predicted&nbsp;Expenses
          </Typography>
          <Tooltip
            title={
              'Predicted funds left that can be spent for Expenses in Period.'
            }
            placement="top"
          >
            <HelpOutlineIcon />
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
