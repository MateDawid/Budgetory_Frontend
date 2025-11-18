import React, { useContext, useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import { Typography, Paper, Box, Stack, Chip } from '@mui/material';
import { getApiObjectDetails } from '../../app_infrastructure/services/APIService';
import { useNavigate, useParams } from 'react-router-dom';
import EditableTextField from '../../app_infrastructure/components/EditableTextField';
import { BudgetContext } from '../../app_infrastructure/store/BudgetContext';
import DeleteButton from '../../app_infrastructure/components/DeleteButton';
import PeriodStatuses from '../utils/PeriodStatuses';
import BudgetingPeriodStatusUpdateButton from '../components/BudgetingPeriodStatusUpdateButton';
import onEditableFieldSave from '../../app_infrastructure/utils/onEditableFieldSave';

/**
 * BudgetingPeriodDetail component to display details of single BudgetingPeriod.
 */
export default function BudgetingPeriodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contextBudgetId, refreshTimestamp, setRefreshTimestamp } =
    useContext(BudgetContext);
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods/`;
  const { setAlert } = useContext(AlertContext);
  const [objectData, setObjectData] = useState([]);
  const objectFields = {
    name: {
      type: 'string',
      label: 'Name',
      autoFocus: true,
      required: true,
    },
    date_start: {
      type: 'date',
      label: 'Date start',
      required: true,
    },
    date_end: {
      type: 'date',
      label: 'Date end',
      required: true,
    },
  };

  /**
   * Fetches BudgetingPeriod detail from API.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const apiResponse = await getApiObjectDetails(apiUrl, id);
        setObjectData(apiResponse);
      } catch {
        setAlert({ type: 'error', message: 'Period details loading failed.' });
        navigate('/periods');
      }
    };
    if (!contextBudgetId) {
      return;
    }
    loadData();
  }, [refreshTimestamp, contextBudgetId]);

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
      setRefreshTimestamp,
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
            <BudgetingPeriodStatusUpdateButton
              apiUrl={apiUrl}
              objectId={objectData.id}
              newPeriodStatus={PeriodStatuses.ACTIVE}
              objectName={objectData.name}
            />
          )}
          {objectData.status === PeriodStatuses.ACTIVE && (
            <BudgetingPeriodStatusUpdateButton
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
        {Object.keys(objectFields).map((fieldName) => (
          <EditableTextField
            key={fieldName}
            apiFieldName={fieldName}
            initialValue={objectData[fieldName]}
            inputProps={
              objectFields[fieldName]['type'] === 'date'
                ? { max: '9999-12-31' }
                : {}
            }
            fullWidth
            onSave={onSave}
            isEditable={objectData.status === 1}
            {...objectFields[fieldName]}
          />
        ))}
      </Box>
    </Paper>
  );
}
