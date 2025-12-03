import {
  TableRow,
  TableCell,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';
import React, { useState, useContext } from 'react';
import ColouredLinearProgress from '../../../app_infrastructure/components/CustomLinearProgress/ColouredLinearProgress';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PredictionDeleteModal from '../PredictionModal/PredictionDeleteModal';
import { getFontColor } from '../utils';
import { getCategoryCellContent } from './utils';
import PredictionInspectModal from '../PredictionModal/PredictionInspectModal';
import PredictionEditModal from '../PredictionModal/PredictionEditModal';

/**
 * DraftPeriodPredictionRow component to display ExpensePrediction data row with data suitable for DRAFT Period.
 * @param {object} props
 * @param {object} props.row - Table row object.
 */
export default function DraftPeriodPredictionRow({ row }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);
  const { contextBudgetCurrency } = useContext(BudgetContext);

  const previousResultsFontColor = getFontColor(
    row.previous_result,
    row.previous_plan
  );
  const currentResultsFontColor = getFontColor(
    row.current_result,
    row.current_plan
  );

  return (
    <>
      <TableRow>
        <TableCell align="center">{row.category_deposit}</TableCell>
        <TableCell align="center">{getCategoryCellContent(row)}</TableCell>
        <TableCell align="center" sx={{ color: previousResultsFontColor }}>
          {row.previous_result}
          {`\u00A0${contextBudgetCurrency}`} / {row.previous_plan}
          {`\u00A0${contextBudgetCurrency}`}
        </TableCell>
        <TableCell align="center" sx={{ color: currentResultsFontColor }}>
          {row.current_result}
          {`\u00A0${contextBudgetCurrency}`} / {row.current_plan}
          {`\u00A0${contextBudgetCurrency}`}
        </TableCell>
        <TableCell align="center" sx={{ color: currentResultsFontColor }}>
          {row.current_funds_left}
          {`\u00A0${contextBudgetCurrency}`}
        </TableCell>
        <TableCell align="center">
          <Stack
            gap={1}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color={currentResultsFontColor}>
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
        <TableCell align="right" sx={{ maxWidth: 50 }}>
          <IconButton onClick={() => setInspectOpen(!inspectOpen)}>
            <SearchIcon />
          </IconButton>
          {row.category !== null && (
            <>
              <IconButton onClick={() => setEditOpen(!editOpen)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => setDeleteOpen(!deleteOpen)}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </TableCell>
      </TableRow>
      <PredictionInspectModal
        periodId={row.period}
        categoryId={row.category}
        inspectOpen={inspectOpen}
        setInspectOpen={setInspectOpen}
      />
      <PredictionDeleteModal
        predictionId={row.id}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
      />
      <PredictionEditModal
        formOpen={editOpen}
        setFormOpen={setEditOpen}
        editedPrediction={row}
      />
    </>
  );
}
