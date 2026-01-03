import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { WalletContext } from '../../app_infrastructure/store/WalletContext';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import FilterField from '../../app_infrastructure/components/FilterField';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import CopyPreviousPredictionsButton from '../components/CopyPreviousPredictionsButton';
import PeriodFilterField from '../components/PeriodFilterField';
import ExpensePredictionTable from '../components/ExpensePredictionTable/ExpensePredictionTable';
import PeriodResultsTable from '../components/PeriodResultsTable/PeriodResultsTable';
import PredictionAddModal from '../components/PredictionModal/PredictionAddModal';
import StyledButton from '../../app_infrastructure/components/StyledButton';
import AddIcon from '@mui/icons-material/Add';
import PeriodStatuses from '../../periods/utils/PeriodStatuses';

const UNCATEGORIZED_PRIORITY = -1;

const baseOrderingOptions = [
  { value: 'category__name', label: 'Category name ↗' },
  { value: '-category__name', label: 'Category name ↘' },
  { value: 'category__priority', label: 'Category priority ↗' },
  { value: '-category__priority', label: 'Category priority ↘' },
  { value: 'current_plan', label: 'Current plan ↗' },
  { value: '-current_plan', label: 'Current plan ↘' },
  { value: 'current_result', label: 'Current result ↗' },
  { value: '-current_result', label: 'Current result ↘' },
  { value: 'current_funds_left', label: 'Funds left ↗' },
  { value: '-current_funds_left', label: 'Funds left ↘' },
  { value: 'current_progress', label: 'Progress ↗' },
  { value: '-current_progress', label: 'Progress ↘' },
];

const draftPeriodOrderingOptions = [
  { value: 'previous_result', label: 'Previous result ↗' },
  { value: '-previous_result', label: 'Previous result ↘' },
  { value: 'previous_funds_left', label: 'Previous funds left ↗' },
  { value: '-previous_funds_left', label: 'Previous funds left ↘' },
];

/**
 * ExpensePredictionsPage component to display list of ExpensePredictions
 */
export default function ExpensePredictionsPage() {
  const { contextWalletId, refreshTimestamp } = useContext(WalletContext);
  const { setAlert } = useContext(AlertContext);
  const [periodResultsLoading, setPeriodResultsLoading] = useState(false);
  const [predictionsLoading, setPredictionsLoading] = useState(false);

  // Urls
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/expense_predictions/`;
  const copyPredictionsUrl = `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/copy_predictions_from_previous_period/`;

  // Selectors choices
  const [periods, setPeriods] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [progressStatuses, setProgressStatuses] = useState([]);

  // Filters values
  const [periodFilter, setPeriodFilter] = useState('');
  const [depositFilter, setDepositFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [progressStatusFilter, setProgressStatusFilter] = useState(null);
  const [orderingFilter, setOrderingFilter] = useState(null);

  // Data
  const [periodStatus, setPeriodStatus] = useState(0);
  const [periodStatusLabel, setPeriodStatusLabel] = useState(null);
  const [periodPredictions, setPeriodPredictions] = useState([]);
  const [periodResults, setPeriodResults] = useState([]);

  const [addFormOpen, setAddFormOpen] = useState(false);

  /**
   * Fetches select options for ExpensePrediction select fields from API.
   */
  useEffect(() => {
    async function getPeriodsChoices() {
      try {
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/periods/`
        );
        setPeriods(response);
      } catch {
        setPeriods([]);
      }
    }

    async function getDeposits() {
      const depositsResponse = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/deposits/`
      );
      setDeposits(depositsResponse);
    }

    async function getPriorities() {
      const priorityResponse = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/categories/priorities/?type=2`
      );
      setPriorities([
        { value: UNCATEGORIZED_PRIORITY, label: '❗Not categorized' },
        ...priorityResponse.results,
      ]);
    }

    async function getProgressStatuses() {
      const progressStatusResponse = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/predictions/progress_statuses/`
      );
      setProgressStatuses(progressStatusResponse);
    }

    if (!contextWalletId) {
      return;
    }
    getPeriodsChoices();
    getDeposits();
    getPriorities();
    getProgressStatuses();
  }, [contextWalletId]);

  /**
   * Fetches select options for ExpensePrediction categories object from API.
   */
  useEffect(() => {
    async function getCategories() {
      const filterModel = {};
      if (depositFilter) {
        filterModel['deposit'] = depositFilter;
      }
      if (priorityFilter) {
        filterModel['priority'] = priorityFilter;
      }
      const categoryResponse = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/categories/?category_type=2`,
        {},
        {},
        filterModel
      );
      setCategories(categoryResponse);
      setCategoryFilter(null);
    }
    if (
      !contextWalletId ||
      (!priorityFilter && !depositFilter) ||
      priorityFilter === UNCATEGORIZED_PRIORITY
    ) {
      return;
    }
    getCategories();
  }, [contextWalletId, depositFilter, priorityFilter]);

  /**
   * Fetches Period results from API.
   */
  useEffect(() => {
    async function getPeriodResults() {
      const depositsPeriodResultsResponse = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/deposits_predictions_results/${periodFilter}/`
      );
      setPeriodResults(depositsPeriodResultsResponse);
      setPeriodResultsLoading(false);
    }
    if (!contextWalletId || !periodFilter) {
      return;
    }
    setPeriodResultsLoading(true);
    getPeriodResults();
  }, [periodFilter, refreshTimestamp]);

  /**
   * Fetches ExpensePrediction objects from API.
   */
  useEffect(() => {
    const getFilterModel = () => {
      const filterModel = {};
      const selectFilters = [
        { value: periodFilter, apiField: 'period' },
        { value: categoryFilter, apiField: 'category' },
        { value: depositFilter, apiField: 'deposit' },
        { value: progressStatusFilter, apiField: 'progress_status' },
        { value: priorityFilter, apiField: 'category_priority' },
        { value: orderingFilter, apiField: 'ordering' },
      ];
      selectFilters.forEach((object) => {
        if (object.value !== null) {
          filterModel[[object.apiField]] = object.value;
        }
      });

      return filterModel;
    };
    async function getPredictions() {
      const predictionsResponse = await getApiObjectsList(
        apiUrl,
        {},
        {},
        getFilterModel()
      );
      setPeriodPredictions(predictionsResponse);
      setPredictionsLoading(false);
    }
    if (!contextWalletId || !periodFilter) {
      setPeriodPredictions([]);
      return;
    }
    setPredictionsLoading(true);
    getPredictions();
  }, [
    refreshTimestamp,
    depositFilter,
    priorityFilter,
    categoryFilter,
    periodFilter,
    progressStatusFilter,
    orderingFilter,
  ]);

  const addButton = (
    <StyledButton
      variant="outlined"
      startIcon={<AddIcon />}
      onClick={() => setAddFormOpen(true)}
      disabled={!periodFilter}
    >
      Add
    </StyledButton>
  );

  // Period results section establishing

  let periodResultsSectionContent = (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
      mt={2}
      mb={1}
    >
      <Typography color="primary" fontWeight="bold">
        Period not selected.
      </Typography>
    </Stack>
  );

  if (periodResultsLoading) {
    periodResultsSectionContent = (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="3rem" />
      </Box>
    );
  } else if (periodFilter && periodResults.length > 0) {
    periodResultsSectionContent = (
      <PeriodResultsTable results={periodResults} />
    );
  } else if (periodFilter && periodResults.length <= 0) {
    periodResultsSectionContent = (
      <Stack
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        mt={2}
        mb={1}
      >
        <Typography color="primary" fontWeight="bold">
          No Period results to display.
        </Typography>
      </Stack>
    );
  }

  // Prediction section establishing
  let predictionSectionContent = (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
      mt={2}
      mb={1}
    >
      <Typography color="primary" fontWeight="bold">
        Period not selected.
      </Typography>
    </Stack>
  );
  if (predictionsLoading) {
    predictionSectionContent = (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="3rem" />
      </Box>
    );
  }

  // @ts-ignore
  else if (periodFilter && periodPredictions.length > 0) {
    predictionSectionContent = (
      <ExpensePredictionTable
        predictions={periodPredictions}
        periodStatus={periodStatus}
      />
    );
  } else if (periodFilter && periodPredictions.length <= 0) {
    predictionSectionContent = (
      <Stack
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        mb={1}
      >
        <Typography color="primary" fontWeight="bold">
          No Predictions found.
        </Typography>
        {periodStatus === PeriodStatuses.DRAFT && addButton}
        {periodStatus === PeriodStatuses.DRAFT &&
          periods.length > 1 &&
          !categoryFilter &&
          !depositFilter && (
            <CopyPreviousPredictionsButton
              periodId={periodFilter}
              apiUrl={copyPredictionsUrl}
              setAlert={setAlert}
            />
          )}
      </Stack>
    );
  }

  return (
    <>
      <Paper
        elevation={24}
        sx={{
          padding: 2,
          bgColor: '#F1F1F1',
        }}
      >
        {/* Main header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          mb={1}
        >
          <Typography variant="h4" sx={{ display: 'block', color: '#BD0000' }}>
            Expenses Predictions in Period
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            {periodStatusLabel && (
              <Chip label={periodStatusLabel} variant="outlined" />
            )}
            <PeriodFilterField
              periodOptions={periods}
              periodFilter={periodFilter || ''}
              setPeriodFilter={setPeriodFilter}
              setPeriodStatus={setPeriodStatus}
              setPeriodStatusLabel={setPeriodStatusLabel}
            />
          </Stack>
        </Stack>
        <Divider />
        {/* Users summaries */}
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h5" sx={{ display: 'block', color: '#BD0000' }}>
            Period results
          </Typography>
          <Divider sx={{ mb: 1 }} />
          {periodResultsSectionContent}
        </Box>
        {/* Predictions objects */}
        <Box sx={{ marginTop: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            mt={2}
            mb={1}
          >
            <Typography
              variant="h5"
              sx={{ display: 'block', color: '#BD0000' }}
            >
              Predictions
            </Typography>
            {periodPredictions.length > 0 && addButton}
          </Stack>
          <Divider sx={{ mb: 1 }} />
          {periodFilter && !predictionsLoading && (
            <Stack
              direction={{ sm: 'column', md: 'row' }}
              alignItems={{ sm: 'flex-start', md: 'center' }}
              justifyContent="flex-start"
              spacing={1}
              mb={1}
              mt={1}
            >
              <FilterField
                filterValue={depositFilter}
                setFilterValue={setDepositFilter}
                options={deposits}
                label="Deposit"
                sx={{ width: { sm: '100%', md: 200 }, margin: 0 }}
              />
              <FilterField
                filterValue={priorityFilter}
                setFilterValue={setPriorityFilter}
                options={priorities}
                label="Category Priority"
                sx={{ width: { sm: '100%', md: 200 }, margin: 0 }}
              />
              <FilterField
                filterValue={categoryFilter}
                setFilterValue={setCategoryFilter}
                options={categories}
                label="Category"
                sx={{ width: { sm: '100%', md: 200 }, margin: 0 }}
                disabled={
                  !depositFilter || priorityFilter === UNCATEGORIZED_PRIORITY
                }
                groupBy={(option) => option.priority_display}
                renderGroup={(params) => (
                  <li key={params.key}>
                    <div
                      style={{
                        fontWeight: '400',
                        fontSize: '14px',
                        padding: '8px 16px',
                        color: 'rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      {params.group}
                    </div>
                    <ul style={{ padding: 0 }}>{params.children}</ul>
                  </li>
                )}
              />
              <FilterField
                filterValue={progressStatusFilter}
                setFilterValue={setProgressStatusFilter}
                options={progressStatuses}
                label="Progress"
                sx={{ width: { sm: '100%', md: 200 }, margin: 0 }}
              />
              <FilterField
                filterValue={orderingFilter}
                setFilterValue={setOrderingFilter}
                options={
                  periodStatus === PeriodStatuses.DRAFT
                    ? [...baseOrderingOptions, ...draftPeriodOrderingOptions]
                    : baseOrderingOptions
                }
                label="Sort by"
                sx={{ width: { sm: '100%', md: 200 }, margin: 0 }}
              />
            </Stack>
          )}
          {predictionSectionContent}
        </Box>
      </Paper>
      <PredictionAddModal
        apiUrl={apiUrl}
        formOpen={addFormOpen}
        setFormOpen={setAddFormOpen}
        periodId={periodFilter}
      />
    </>
  );
}
