import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { WalletContext } from '../../../app_infrastructure/store/WalletContext';
import { getFontColor } from '../utils';
import ColouredLinearProgress from '../../../app_infrastructure/components/CustomLinearProgress/ColouredLinearProgress';

/**
 * PeriodResultsRow component to display results of Predictions realization for specified Period.
 * @param {object} props
 * @param {object} props.row - Table row object.
 */
export default function PeriodResultsRow({ row }) {
  const { contextWalletCurrency } = useContext(WalletContext);

  const predictionsFont = getFontColor(row.predictions_sum, row.period_balance);
  const expensesFont = getFontColor(row.period_expenses, row.predictions_sum);

  return (
    <TableRow>
      <TableCell align="center">{row.deposit_name}</TableCell>
      <TableCell align="center">
        <Stack
          gap={1}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color={predictionsFont}>
            {row.predictions_sum}&nbsp;{contextWalletCurrency} /{' '}
            {row.period_balance}&nbsp;{contextWalletCurrency}
          </Typography>
          <ColouredLinearProgress
            currentValue={row.predictions_sum}
            maxValue={row.period_balance}
          />
        </Stack>
      </TableCell>
      <TableCell
        align="center"
        sx={{ color: predictionsFont, fontWeight: 'bold' }}
      >
        {row.funds_left_for_predictions}&nbsp;{contextWalletCurrency}
      </TableCell>
      <TableCell align="center">
        <Stack
          gap={1}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color={expensesFont}>
            {row.period_expenses}&nbsp;{contextWalletCurrency} /{' '}
            {row.predictions_sum}&nbsp;{contextWalletCurrency}
          </Typography>
          <ColouredLinearProgress
            currentValue={row.period_expenses}
            maxValue={row.predictions_sum}
          />
        </Stack>
      </TableCell>
      <TableCell
        align="center"
        sx={{ color: expensesFont, fontWeight: 'bold' }}
      >
        {row.funds_left_for_expenses}&nbsp;{contextWalletCurrency}
      </TableCell>
    </TableRow>
  );
}
