import React, { useContext } from 'react';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { WalletContext } from '../../../app_infrastructure/store/WalletContext';
import TransferTypes from '../../utils/TransferTypes';
import { Box, Typography, Button } from '@mui/material';
import StyledModal from '../../../app_infrastructure/components/StyledModal';
import { copyApiObjects } from '../../../app_infrastructure/services/APIService';

/**
 * TransferCopyModal component for displaying copy Transfer form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {number} props.transferType - Type of Transfer. Options: TransferTypes.INCOME, TransferTypes.EXPENSE.
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {array} [props.selectedRows] - Transfer objects selected in DataGrid.
 */
export default function TransferCopyModal({
  apiUrl,
  transferType,
  formOpen,
  setFormOpen,
  selectedRows,
}) {
  const { updateRefreshTimestamp } = useContext(WalletContext);
  const { setAlert } = useContext(AlertContext);

  /**
   * Function to handle copying objects in API.
   */
  const handleCopy = async () => {
    try {
      await copyApiObjects(apiUrl, selectedRows);
      setAlert({
        type: 'success',
        message: `Selected Transfers copied successfully.`,
      });
      updateRefreshTimestamp();
    } catch (error) {
      setAlert({ type: 'error', message: 'Transfers copying failed.' });
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
          Copy {transferType === TransferTypes.INCOME ? 'Incomes' : 'Expenses'}
        </Typography>
        <Box component="form" onSubmit={handleCopy} noValidate sx={{ mt: 1 }}>
          <Typography>
            Are you sure you want to copy selected{' '}
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
              Copy
            </Button>
          </Box>
        </Box>
      </Box>
    </StyledModal>
  );
}
