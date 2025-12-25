import React, { useContext } from 'react';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import { deleteApiObject } from '../../../app_infrastructure/services/APIService';
import { Box, Typography, Button } from '@mui/material';
import StyledModal from '../../../app_infrastructure/components/StyledModal';

/**
 * CategoryDeleteModal component for displaying delete Category form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {string} [props.deletedCategoryId] - Category object to be deleted id value.
 * @param {function} [props.setDeletedCategoryId] - Setter for deletedCategoryId value.
 */
export default function CategoryDeleteModal({
  apiUrl,
  formOpen,
  setFormOpen,
  deletedCategoryId,
  setDeletedCategoryId,
}) {
  const { updateRefreshTimestamp } = useContext(BudgetContext);
  const { setAlert } = useContext(AlertContext);

  /**
   * Function to handle deleting object in API.
   */
  const handleDelete = async () => {
    try {
      await deleteApiObject(apiUrl, deletedCategoryId);
      updateRefreshTimestamp();
      setAlert({
        type: 'success',
        message: `Category deleted successfully.`,
      });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  return (
    <StyledModal
      open={formOpen}
      onClose={() => {
        setFormOpen(false);
        setDeletedCategoryId(undefined);
      }}
    >
      <Box width={400} bgcolor="#F1F1F1" p={3} borderRadius={5}>
        <Typography variant="h6" component="h2" textAlign="center">
          Delete Category
        </Typography>
        <Box component="form" onSubmit={handleDelete} noValidate sx={{ mt: 1 }}>
          <Typography> Are you sure you want to delete Category? </Typography>
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
