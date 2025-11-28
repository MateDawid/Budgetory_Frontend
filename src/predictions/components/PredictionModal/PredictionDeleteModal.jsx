import { Typography, Box, Button } from '@mui/material';
import React, { useContext } from 'react';
import { deleteApiObject } from '../../../app_infrastructure/services/APIService';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import StyledModal from '../../../app_infrastructure/components/StyledModal';

export default function PredictionDeleteModal({
  predictionId,
  deleteOpen,
  setDeleteOpen,
}) {
  const { contextBudgetId, updateRefreshTimestamp } = useContext(BudgetContext);
  const { setAlert } = useContext(AlertContext);

  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expense_predictions/`;

  /**
   * Function to handle deleting object in API.
   */
  const handleDelete = async () => {
    try {
      await deleteApiObject(apiUrl, predictionId);
      updateRefreshTimestamp();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  return (
    <StyledModal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
      <Box width={400} bgcolor="#F1F1F1" p={3} borderRadius={5}>
        <Typography variant="h6" component="h2" textAlign="center">
          Delete prediction
        </Typography>
        <Box component="form" onSubmit={handleDelete} noValidate sx={{ mt: 1 }}>
          <Typography>Are you sure you want to delete Prediction?</Typography>
          <Box display="flex" justifyContent="space-between">
            <Button
              onClick={() => setDeleteOpen(false)}
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
