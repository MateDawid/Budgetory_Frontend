import React, { useContext } from 'react';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { WalletContext } from '../../../app_infrastructure/store/WalletContext';
import { deleteApiObject } from '../../../app_infrastructure/services/APIService';
import { Box, Typography, Button } from '@mui/material';
import StyledModal from '../../../app_infrastructure/components/StyledModal';
import { EntityTypes } from '../EntityDataGrid';

const ENTITY_DELETE_MESSAGE =
  'Removing Entity is irreversible.\n\nDo you want to continue?';
const DEPOSIT_DELETE_MESSAGE =
  'Removing Deposit will cause removing all connected items like Categories, Predictions, Incomes and Expenses and is irreversible.\n\nDo you want to continue?';

/**
 * EntityDeleteModal component for displaying delete Entity form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {number} props.entityType - Type of Entity (Entity or Deposit)
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {string} [props.deletedEntityId] - Entity object to be deleted id value.
 * @param {function} [props.setDeletedEntityId] - Setter for deletedEntityId value.
 */
export default function EntityDeleteModal({
  apiUrl,
  entityType,
  formOpen,
  setFormOpen,
  deletedEntityId,
  setDeletedEntityId,
}) {
  const { updateRefreshTimestamp } = useContext(WalletContext);
  const { setAlert } = useContext(AlertContext);

  /**
   * Function to handle deleting object in API.
   */
  const handleDelete = async () => {
    try {
      await deleteApiObject(apiUrl, deletedEntityId);
      updateRefreshTimestamp();
      setAlert({
        type: 'success',
        message: `${entityType === EntityTypes.ENTITY ? 'Entity' : 'Deposit'} deleted successfully.`,
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
        setDeletedEntityId(undefined);
      }}
    >
      <Box width={400} bgcolor="#F1F1F1" p={3} borderRadius={5}>
        <Typography variant="h6" component="h2" textAlign="center">
          Delete {entityType === EntityTypes.ENTITY ? 'Entity' : 'Deposit'}
        </Typography>
        <Box component="form" onSubmit={handleDelete} noValidate sx={{ mt: 1 }}>
          <Typography sx={{ whiteSpace: 'pre-line' }}>
            {entityType === EntityTypes.ENTITY
              ? ENTITY_DELETE_MESSAGE
              : DEPOSIT_DELETE_MESSAGE}
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
