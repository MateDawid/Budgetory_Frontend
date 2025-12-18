import React, { useContext, useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import { Typography, Paper, Box, Stack, Chip } from '@mui/material';
import {
  getApiObjectDetails,
  getApiObjectsList,
} from '../../app_infrastructure/services/APIService';
import { useNavigate, useParams } from 'react-router-dom';
import EditableTextField from '../../app_infrastructure/components/EditableTextField';
import { BudgetContext } from '../../app_infrastructure/store/BudgetContext';
import DeleteButton from '../../app_infrastructure/components/DeleteButton';
import onEditableFieldSave from '../../app_infrastructure/utils/onEditableFieldSave';
import PeriodsTransfersChart from '../../landing_page/components/PeriodsTransfersChart';

/**
 * DepositDetail component to display details of single Deposit.
 */
export default function DepositDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updatedObjectParam, setUpdatedObjectParam] = useState(null);
  const { contextBudgetId, updateRefreshTimestamp } = useContext(BudgetContext);
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`;
  const { setAlert } = useContext(AlertContext);
  const [objectData, setObjectData] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [ownerOptions, setOwnerOptions] = useState([]);
  const objectFields = {
    name: {
      type: 'string',
      label: 'Name',
      autoFocus: true,
      required: true,
    },
    description: {
      type: 'string',
      label: 'Description',
      required: false,
      multiline: true,
      rows: 4,
    },
    deposit_type: {
      type: 'select',
      select: true,
      label: 'Type',
      required: true,
      options: typeOptions,
    },
    owner: {
      type: 'select',
      select: true,
      label: 'Owner',
      required: false,
      options: ownerOptions,
    },
    is_active: {
      type: 'select',
      select: true,
      label: 'Status',
      required: true,
      options: [
        {
          value: true,
          label: '🟢 Active',
        },
        {
          value: false,
          label: '🔴 Inactive',
        },
      ],
    },
  };

  /**
   * Fetches Budgets list from API.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const apiResponse = await getApiObjectDetails(apiUrl, id);
        setObjectData(apiResponse);
      } catch {
        setAlert({ type: 'error', message: 'Deposit details loading failed.' });
        navigate('/deposits');
      }
    };
    if (!contextBudgetId) {
      return;
    }
    loadData();
  }, [updatedObjectParam, contextBudgetId]);

  /**
   * Fetches select options for Deposit.owner field from API.
   */
  useEffect(() => {
    const loadOwnerOptions = async () => {
      try {
        const ownerResponse = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/members/`
        );
        setOwnerOptions([{ value: -1, label: '🏦 Common' }, ...ownerResponse]);
        const typeResponse = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/entities/deposit_types/`
        );
        setTypeOptions(typeResponse.results);
      } catch {
        setAlert({
          type: 'error',
          message: 'Failed to load select fields data.',
        });
      }
    };
    if (!contextBudgetId) {
      return;
    }
    loadOwnerOptions();
  }, [contextBudgetId]);

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
      setUpdatedObjectParam,
      setAlert
    );
    updateRefreshTimestamp();
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
            objectDisplayName="Deposit"
            redirectOnSuccess={'/deposits'}
            rightbarDepositsRefresh
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
            {...objectFields[fieldName]}
          />
        ))}
      </Box>
      <Box>
        <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>
          Transfers in Periods
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <PeriodsTransfersChart depositId={id} />
      </Box>
    </Paper>
  );
}
