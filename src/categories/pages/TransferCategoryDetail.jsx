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
import CategoryResultsAndPredictionsInPeriodsChart from '../../charts/components/CategoryResultsAndPredictionsInPeriodsChart';
import CategoryTypes from '../utils/CategoryTypes';

/**
 * TransferCategoryDetail component to display details of single Transfer Category.
 */
export default function TransferCategoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contextBudgetId, refreshTimestamp, updateRefreshTimestamp } =
    useContext(BudgetContext);
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/`;
  const { setAlert } = useContext(AlertContext);
  const [objectData, setObjectData] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [depositOptions, setDepositOptions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const apiResponse = await getApiObjectDetails(apiUrl, id);
        setObjectData(apiResponse);
        document.title = `Category • ${apiResponse.label}`;
      } catch {
        setAlert({
          type: 'error',
          message: 'Category details loading failed.',
        });
        navigate('/categories');
      }
    };
    if (!contextBudgetId) {
      return;
    }
    loadData();
  }, [refreshTimestamp, contextBudgetId]);

  /**
   * Fetches select options for Category select fields from API.
   */
  useEffect(() => {
    async function getDeposits() {
      const response = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`
      );
      setDepositOptions(response);
    }
    async function getCategoryTypes() {
      const typeResponse = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/categories/types`
      );
      setTypeOptions(typeResponse.results);
    }
    async function getPriorities() {
      const priorityResponse = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/categories/priorities`
      );
      setPriorityOptions(priorityResponse.results);
    }

    if (!contextBudgetId) {
      return;
    }
    getDeposits();
    getCategoryTypes();
    getPriorities();
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
            {objectData.label}
          </Typography>
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
            objectDisplayName="Transfer Category"
            redirectOnSuccess={'/categories'}
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
            label="Type"
            apiFieldName="category_type"
            initialValue={objectData.category_type}
            fullWidth
            onSave={onSave}
            required
            disabled
            type="select"
            options={typeOptions}
            select
          />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <EditableTextField
            label="Deposit"
            apiFieldName="deposit"
            initialValue={objectData.deposit}
            fullWidth
            onSave={onSave}
            required
            type="select"
            options={depositOptions}
            select
          />
          <EditableTextField
            label="Priority"
            apiFieldName="priority"
            initialValue={objectData.priority}
            fullWidth
            onSave={onSave}
            required
            type="select"
            options={priorityOptions}
            select
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
        <Box>
          <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>
            Category{' '}
            {objectData.category_type === CategoryTypes.INCOME
              ? 'results'
              : 'results and predictions'}{' '}
            in Periods
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <CategoryResultsAndPredictionsInPeriodsChart
            categoryId={id}
            categoryType={objectData.category_type}
          />
        </Box>
      </Box>
    </Paper>
  );
}
