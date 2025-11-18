import React, { useContext } from 'react';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import TransferTypes from '../../utils/TransferTypes';
import { Box, Typography, Button } from '@mui/material';
import StyledModal from '../../../app_infrastructure/components/StyledModal';
import { bulkDeleteApiObjects } from '../../../app_infrastructure/services/APIService';

/**
 * TransferBulkDeleteModal component for displaying bulk delete Transfer form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {number} props.transferType - Type of Transfer. Options: TransferTypes.INCOME, TransferTypes.EXPENSE.
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {array} [props.selectedRows] - Transfer objects selected in DataGrid.
 */
export default function TransferBulkDeleteModal({
  apiUrl,
  transferType,
  formOpen,
  setFormOpen,
  selectedRows,
}) {
  const { updateRefreshTimestamp } = useContext(BudgetContext);
  const { setAlert } = useContext(AlertContext);

  /**
   * Function to handle deleting objects in API.
   */
  const handleDelete = async () => {
    try {
      await bulkDeleteApiObjects(apiUrl, selectedRows);
      setAlert({
        type: 'success',
        message: `Selected Transfers deleted successfully.`,
      });
      updateRefreshTimestamp();
    } catch (error) {
      setAlert({ type: 'error', message: 'Transfers deleting failed.' });
      console.error(error);
    }
  };

  return (
    <StyledModal
      open={formOpen}
      onClose={() => {
        setFormOpen(false);
      }}
    >
      <Box width={400} bgcolor="#F1F1F1" p={3} borderRadius={5}>
        <Typography variant="h6" component="h2" textAlign="center">
          Delete{' '}
          {transferType === TransferTypes.INCOME ? 'Incomes' : 'Expenses'}
        </Typography>
        <Box component="form" onSubmit={handleDelete} noValidate sx={{ mt: 1 }}>
          <Typography>
            Are you sure you want to delete selected{' '}
            {transferType === TransferTypes.EXPENSE ? 'Expenses' : 'Incomes'}?
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Button
              onClick={() => setFormOpen(false)}
              variant="contained"
              fullWidth
              sx={{
                width: '45%',
                mt: 2,
                backgroundColor: '#FFFFFF',
                color: '#BD0000',
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                width: '45%',
                mt: 2,
                backgroundColor: '#BD0000',
                color: '#FFFFFF',
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Box>
    </StyledModal>
  );
}
