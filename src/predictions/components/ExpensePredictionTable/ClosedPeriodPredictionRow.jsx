import {
  TableRow,
  TableCell,
  Stack,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import ColouredLinearProgress from '../../../app_infrastructure/components/CustomLinearProgress/ColouredLinearProgress';
import { WalletContext } from '../../../app_infrastructure/store/WalletContext';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { getFontColor } from '../utils';
import { getCategoryCellContent } from './utils';
import PredictionInspectModal from '../PredictionModal/PredictionInspectModal';

/**
 * DraftPeriodPredictionRow component to display ExpensePrediction data row with data suitable for CLOSED Period.
 * @param {object} props
 * @param {object} props.row - Table row object.
 */
export default function ClosedPeriodPredictionRow({ row }) {
  const [inspectOpen, setInspectOpen] = useState(false);
  const { contextWalletCurrency } = useContext(WalletContext);

  const fontColor = getFontColor(row.current_result, row.current_plan);

  return (
    <>
      <TableRow>
        <TableCell align="center">{row.category_deposit}</TableCell>
        <TableCell align="center">{getCategoryCellContent(row)}</TableCell>
        <TableCell align="center">
          <Stack
            direction="row"
            spacing={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="body2" color={fontColor}>
              {row.current_result}
              {`\u00A0${contextWalletCurrency}`} / {row.current_plan}
              {`\u00A0${contextWalletCurrency}`}
            </Typography>
            {row.current_plan !== row.initial_plan && (
              <Tooltip
                title={`Initial prediction value: ${row.initial_plan}\u00A0${contextWalletCurrency}`}
                placement="top"
              >
                <HelpOutlineIcon />
              </Tooltip>
            )}
          </Stack>
        </TableCell>
        <TableCell align="center" sx={{ color: fontColor }}>
          {row.current_funds_left}
          {`\u00A0${contextWalletCurrency}`}
        </TableCell>
        <TableCell align="center">
          <Stack
            gap={1}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color={fontColor}>
              {row.current_progress}&nbsp;%
            </Typography>

            <ColouredLinearProgress
              currentValue={row.current_result}
              maxValue={row.current_plan}
            />
          </Stack>
        </TableCell>
        <TableCell sx={{ minWidth: 180, maxWidth: 300 }}>
          <Typography
            variant="body2"
            sx={{ whiteSpace: 'pre-wrap', textAlign: 'justify', width: '100%' }}
          >
            {row.description}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={() => setInspectOpen(!inspectOpen)}>
            <SearchIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <PredictionInspectModal
        periodId={row.period}
        categoryId={row.category}
        inspectOpen={inspectOpen}
        setInspectOpen={setInspectOpen}
      />
    </>
  );
}
