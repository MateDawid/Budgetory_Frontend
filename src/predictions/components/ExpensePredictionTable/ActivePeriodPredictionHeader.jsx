import { TableRow, TableCell, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function ActivePeriodPredictionHeader() {
  return (
    <TableRow>
      <TableCell sx={{ fontWeight: 'bold' }} align="center">
        Deposit
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold' }} align="center">
        Category
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
            Result
          </Typography>
          <Tooltip
            title={
              <>
                <b>Actual category expenses</b>
                <br />
                compared to
                <br />
                <b>Planned category expenses</b>
              </>
            }
            placement="top"
          >
            <HelpOutlineIcon />
          </Tooltip>
        </Stack>
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold' }} align="center">
        Funds&nbsp;left
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold' }} align="center">
        Progress
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold' }} align="center">
        Description
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold' }} align="right">
        Actions
      </TableCell>
    </TableRow>
  );
}
