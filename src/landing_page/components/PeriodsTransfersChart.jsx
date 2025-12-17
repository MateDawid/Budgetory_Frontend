import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { BudgetContext } from '../../app_infrastructure/store/BudgetContext';
import { BarChart } from '@mui/x-charts/BarChart';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { Stack } from '@mui/material';
import FilterField from '../../app_infrastructure/components/FilterField';
import CategoryTypes from '../../categories/utils/CategoryTypes';

const TRANSFER_TYPES = [
  { label: 'All', value: null },
  { label: 'Incomes', value: CategoryTypes.INCOME },
  { label: 'Expenses', value: CategoryTypes.EXPENSE },
];
const PERIODS_ON_CHART = [
  { label: 'Previous 3', value: 3 },
  { label: 'Previous 6', value: 6 },
  { label: 'Previous 9', value: 9 },
  { label: 'Previous 12', value: 12 },
  { label: 'Previous 24', value: 24 },
  { label: 'All', value: -1 },
];

/**
 * PeriodsTransfersChart component for displaying BarChart with accumulated Transfers in Periods.
 * @param {object} props
 * @param {string} [props.depositId] - Optional Deposit ID value.
 */
export default function PeriodsTransfersChart({ depositId = null }) {
  const { contextBudgetId, contextBudgetCurrency } = useContext(BudgetContext);
  // Filters values
  const [transferType, setTransferType] = useState(null);
  const [periodsOnChart, setPeriodsOnChart] = useState(12);
  // Chart data
  const [xAxis, setXAxis] = useState([]);
  const [series, setSeries] = useState([]);

  const valueFormatter = (value) =>
    value
      ? `${value.toString()} ${contextBudgetCurrency}`
      : `0 ${contextBudgetCurrency}`;

  useEffect(() => {
    const loadDepositsResults = async () => {
      try {
        const filterModel = {};
        if (depositId) filterModel['deposit'] = depositId;
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
  }, [contextBudgetId, transferType, periodsOnChart]);

  return (
    <Stack sx={{ width: '100%' }}>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" spacing={1}>
          <FilterField
            options={TRANSFER_TYPES}
            label="Transfer type"
            filterValue={transferType}
            setFilterValue={setTransferType}
            sx={{ minWidth: 200 }}
          />
          <FilterField
            options={PERIODS_ON_CHART}
            label="Periods on chart"
            filterValue={periodsOnChart}
            setFilterValue={setPeriodsOnChart}
            sx={{ minWidth: 200 }}
          />
        </Stack>
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
