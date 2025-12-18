import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { BudgetContext } from '../../app_infrastructure/store/BudgetContext';
import { BarChart } from '@mui/x-charts/BarChart';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { Stack } from '@mui/material';
import FilterField from '../../app_infrastructure/components/FilterField';
import CategoryTypes from '../../categories/utils/CategoryTypes';

const TRANSFER_TYPES = [
  { label: 'All Transfers', value: null },
  { label: 'Incomes', value: CategoryTypes.INCOME },
  { label: 'Expenses', value: CategoryTypes.EXPENSE },
];
const PERIODS_ON_CHART = [
  { label: '3 Periods', value: 3 },
  { label: '6 Periods', value: 6 },
  { label: '9 Periods', value: 9 },
  { label: '12 Periods', value: 12 },
  { label: '24 Periods', value: 24 },
  { label: 'All Periods', value: null },
];

/**
 * PeriodsTransfersChart component for displaying BarChart with accumulated Transfers in Periods.
 * @param {object} props
 * @param {string} [props.depositId] - Optional Deposit ID value.
 * @param {string} [props.entityId] - Optional Entity ID value.
 */
export default function PeriodsTransfersChart({
  depositId = null,
  entityId = null,
}) {
  const { contextBudgetId, contextBudgetCurrency } = useContext(BudgetContext);
  // Select choices
  const [depositChoices, setDepositChoices] = useState([]);
  const [entityChoices, setEntityChocies] = useState([]);
  // Filters values
  const [transferType, setTransferType] = useState(null);
  const [periodsOnChart, setPeriodsOnChart] = useState(12);
  const [deposit, setDeposit] = useState(null);
  const [entity, setEntity] = useState(null);
  // Chart data
  const [xAxis, setXAxis] = useState([]);
  const [series, setSeries] = useState([]);

  const valueFormatter = (value) =>
    value
      ? `${value.toString()} ${contextBudgetCurrency}`
      : `0 ${contextBudgetCurrency}`;

  useEffect(() => {
    const loadDepositsChoices = async () => {
      try {
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`
        );
        setDepositChoices(response);
      } catch {
        setDepositChoices([]);
      }
    };
    const loadEntityChoices = async () => {
      try {
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/entities/?ordering=-is_deposit,name`
        );
        setEntityChocies(response);
      } catch {
        setEntityChocies([]);
      }
    };
    if (!contextBudgetId) {
      return;
    }
    if (!depositId) loadDepositsChoices();
    if (!entityId) loadEntityChoices();
  }, [contextBudgetId]);

  useEffect(() => {
    const loadDepositsResults = async () => {
      try {
        const filterModel = {};
        if (depositId) filterModel['deposit'] = depositId;
        if (deposit) filterModel['deposit'] = deposit;
        if (entityId) filterModel['entity'] = entityId;
        if (entity) filterModel['entity'] = entity;
        if (transferType) filterModel['transfer_type'] = transferType;
        if (periodsOnChart) filterModel['periods_count'] = periodsOnChart;
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/period_transfers_chart/`,
          {},
          {},
          filterModel
        );
        setXAxis(response.xAxis);
        const responseSeries = [];
        if (transferType === null || transferType === CategoryTypes.EXPENSE) {
          responseSeries.push({
            data: response.expense_series,
            valueFormatter: valueFormatter,
            color: '#BD0000',
            label: 'Expenses',
          });
        }
        if (transferType === null || transferType === CategoryTypes.INCOME) {
          responseSeries.push({
            data: response.income_series,
            valueFormatter: valueFormatter,
            color: '#008000',
            label: 'Incomes',
          });
        }
        setSeries(responseSeries);
      } catch {
        setXAxis([]);
        setSeries([]);
      }
    };
    if (!contextBudgetId) {
      return;
    }
    loadDepositsResults();
  }, [contextBudgetId, transferType, periodsOnChart, deposit, entity]);

  return (
    <Stack sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <FilterField
          options={TRANSFER_TYPES}
          label="Transfer type"
          filterValue={transferType}
          setFilterValue={setTransferType}
          sx={{ width: 160 }}
        />
        <FilterField
          options={PERIODS_ON_CHART}
          label="Periods on chart"
          filterValue={periodsOnChart}
          setFilterValue={setPeriodsOnChart}
          sx={{ width: 160 }}
        />
        {!depositId && (
          <FilterField
            options={depositChoices}
            label="Deposit"
            filterValue={deposit}
            setFilterValue={setDeposit}
            sx={{ width: 160 }}
          />
        )}
        {!entityId && (
          <FilterField
            options={entityChoices}
            label="Entity"
            filterValue={entity}
            setFilterValue={setEntity}
            groupBy={(option) => (option.is_deposit ? 'Deposits' : 'Entities')}
            sx={{ width: 160 }}
          />
        )}
      </Stack>
      <BarChart
        xAxis={[{ data: xAxis }]}
        yAxis={[{ valueFormatter: (v) => v.toString() }]}
        height={300}
        series={series}
        slotProps={{
          legend: { direction: 'vertical' },
        }}
      />
    </Stack>
  );
}
