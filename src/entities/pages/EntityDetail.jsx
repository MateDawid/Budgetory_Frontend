import React, { useContext, useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import { Typography, Paper, Box, Stack, Chip } from '@mui/material';
import { getApiObjectDetails } from '../../app_infrastructure/services/APIService';
import { useNavigate, useParams } from 'react-router-dom';
import EditableTextField from '../../app_infrastructure/components/EditableTextField';
import { WalletContext } from '../../app_infrastructure/store/WalletContext';
import DeleteButton from '../../app_infrastructure/components/DeleteButton';
import onEditableFieldSave from '../../app_infrastructure/utils/onEditableFieldSave';
import TransfersInPeriodsChart from '../../charts/components/TransfersInPeriodsChart';

/**
 * EntityDetail component to display details of single Entity.
 */
export default function EntityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getContextWalletId, refreshTimestamp, updateRefreshTimestamp } =
    useContext(WalletContext);
  const contextWalletId = getContextWalletId();
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/entities/`;
  const { setAlert } = useContext(AlertContext);
  const [objectData, setObjectData] = useState([]);

  /**
   * Fetches Wallets list from API.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const apiResponse = await getApiObjectDetails(apiUrl, id);
        setObjectData(apiResponse);
        document.title = `Entity • ${apiResponse.name}`;
      } catch {
        setAlert({ type: 'error', message: 'Entity details loading failed.' });
        navigate('/entities');
      }
    };
    if (!contextWalletId) {
      navigate('/wallets');
      setAlert({
        type: 'warning',
        message: 'Entities are unavailable. Please create a Wallet first.',
      });
      return;
    }
    loadData();
  }, [refreshTimestamp, contextWalletId]);

  /**
   * Function to save updated object via API call.
   * @param {string} apiFieldName - Name of updated API field.
   * @param {object} value - New value for updated API field.
   * @return {object} - JSON data with API response.
   */
  const onSave = async (apiFieldName, value) => {
    await onEditableFieldSave(
      id,
      apiFieldName,
      value,
      apiUrl,
      updateRefreshTimestamp,
      setAlert
    );
  };

  return (
    <Paper
      elevation={24}
      sx={{
        padding: 2,
        bgColor: '#F1F1F1',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        mb={1}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          mb={1}
        >
          <Typography variant="h4" sx={{ display: 'block', color: '#BD0000' }}>
            {objectData.name}
          </Typography>
          <Chip
            label={objectData.is_active ? '🟢 Active' : '🔴 Inactive'}
            variant="outlined"
          />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          mb={1}
        >
          <DeleteButton
            apiUrl={apiUrl}
            objectId={objectData.id}
            objectDisplayName="Entity"
            redirectOnSuccess={'/entities'}
          />
        </Stack>
      </Stack>
      <Divider />
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>
          Details
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <EditableTextField
            label="Name"
            apiFieldName="name"
            initialValue={objectData.name}
            fullWidth
            onSave={onSave}
            autoFocus
            required
            type="string"
          />
          <EditableTextField
            label="Status"
            apiFieldName="is_active"
            initialValue={objectData.is_active}
            fullWidth
            onSave={onSave}
            required
            type="select"
            options={[
              {
                value: true,
                label: '🟢 Active',
              },
              {
                value: false,
                label: '🔴 Inactive',
              },
            ]}
          />
        </Stack>
        <EditableTextField
          label="Description"
          apiFieldName="description"
          initialValue={objectData.description}
          fullWidth
          onSave={onSave}
          type="string"
          multiline
          rows={4}
        />
      </Box>
      <Box>
        <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>
          Transfers in Periods
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <TransfersInPeriodsChart entityId={id} />
      </Box>
    </Paper>
  );
}
