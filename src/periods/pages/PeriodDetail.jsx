import React, { useContext, useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import { Typography, Paper, Box, Stack, Chip } from '@mui/material';
import { getApiObjectDetails } from '../../app_infrastructure/services/APIService';
import { useNavigate, useParams } from 'react-router-dom';
import EditableTextField from '../../app_infrastructure/components/EditableTextField';
import DeleteButton from '../../app_infrastructure/components/DeleteButton';
import PeriodStatuses from '../utils/PeriodStatuses';
import PeriodStatusUpdateButton from '../components/PeriodStatusUpdateButton';
import onEditableFieldSave from '../../app_infrastructure/utils/onEditableFieldSave';
import TopEntitiesInPeriodChart from '../../charts/components/TopEntitiesInPeriodChart';
import { WalletContext } from '../../app_infrastructure/store/WalletContext';

/**
 *  PeriodDetail component to display details of single  Period.
 */
export default function PeriodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contextWalletId, refreshTimestamp, updateRefreshTimestamp } =
    useContext(WalletContext);
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/periods/`;
  const { setAlert } = useContext(AlertContext);
  const [objectData, setObjectData] = useState([]);

  /**
   * Fetches  Period detail from API.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const apiResponse = await getApiObjectDetails(apiUrl, id, [
          'name',
          'date_start',
          'date_end',
          'status',
          'status_display',
        ]);
        setObjectData(apiResponse);
        document.title = `Period • ${apiResponse.name}`;
      } catch {
        setAlert({ type: 'error', message: 'Period details loading failed.' });
        navigate('/periods');
      }
    };
    if (!contextWalletId) {
      return;
    }
    loadData();
  }, [refreshTimestamp, contextWalletId]);

  /**
   * Function to save updated object via API call.
   * @param {string} apiFieldName - Name of updated API field.
   * @param {object} value - New value for updated API field.
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
          <Chip label={objectData.status_display} variant="outlined" />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          mb={1}
        >
          {objectData.status === PeriodStatuses.DRAFT && (
            <PeriodStatusUpdateButton
              apiUrl={apiUrl}
              objectId={objectData.id}
              newPeriodStatus={PeriodStatuses.ACTIVE}
              objectName={objectData.name}
            />
          )}
          {objectData.status === PeriodStatuses.ACTIVE && (
            <PeriodStatusUpdateButton
              apiUrl={apiUrl}
              objectId={objectData.id}
              newPeriodStatus={PeriodStatuses.CLOSED}
              objectName={objectData.name}
            />
          )}
          <DeleteButton
            apiUrl={apiUrl}
            objectId={objectData.id}
            objectDisplayName="Period"
            redirectOnSuccess={'/periods'}
            isDisabled={objectData.status !== 1}
          />
        </Stack>
      </Stack>
      <Divider />
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>
          Details
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <EditableTextField
          label="Name"
          isEditable={objectData.status === 1}
          initialValue={objectData.name}
          apiFieldName="name"
          onSave={onSave}
          fullWidth
        />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <EditableTextField
            label="Date start"
            isEditable={objectData.status === 1}
            initialValue={objectData.date_start}
            apiFieldName="date_start"
            onSave={onSave}
            fullWidth
            inputProps={{ max: '9999-12-31' }}
          />
          <EditableTextField
            label="Date end"
            isEditable={objectData.status === 1}
            initialValue={objectData.date_end}
            apiFieldName="date_end"
            onSave={onSave}
            fullWidth
            inputProps={{ max: '9999-12-31' }}
          />
        </Stack>
        <Box>
          <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>
            Entities Transfers
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <TopEntitiesInPeriodChart periodId={id} />
        </Box>
      </Box>
    </Paper>
  );
}
