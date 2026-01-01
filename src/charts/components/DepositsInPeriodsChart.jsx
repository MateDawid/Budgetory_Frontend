import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { BudgetContext } from '../../app_infrastructure/store/BudgetContext';
import FilterField from '../../app_infrastructure/components/FilterField';
import CategoryTypes from '../../categories/utils/CategoryTypes';
import { ChartsContext } from '../../app_infrastructure/store/ChartsContext';

const DISPLAY_CHOICES = [
  { label: 'Expenses', value: CategoryTypes.EXPENSE },
  { label: 'Incomes', value: CategoryTypes.INCOME },
  { label: 'Balance', value: null },
];

export default function DepositsInPeriodsChart() {
  const { contextBudgetId, contextBudgetCurrency } = useContext(BudgetContext);
  const { periodChoices, depositChoices } = useContext(ChartsContext);

  // Filters values
  const [displayValue, setDisplayValue] = useState(CategoryTypes.EXPENSE);
  const [periodFrom, setPeriodFrom] = useState();
  const [periodTo, setPeriodTo] = useState();
  const [deposit, setDeposit] = useState();
  // Chart data
  const [xAxis, setXAxis] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const getFilterModel = () => {
      const filterModel = {};
      const selectFilters = [
        { value: periodFrom, apiField: 'period_from' },
        { value: periodTo, apiField: 'period_to' },
        { value: displayValue, apiField: 'display_value' },
        { value: deposit, apiField: 'deposit' },
      ];
      selectFilters.forEach((object) => {
        if (object.value) {
          filterModel[[object.apiField]] = object.value;
        }
      });

      return filterModel;
    };
    const loadDepositsResults = async () => {
      try {
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/charts/deposits_in_periods/`,
          {},
          {},
          getFilterModel()
        );
        const formattedSeries = response.series.map((serie) => ({
          ...serie,
          valueFormatter: (value) =>
            value
              ? `${value.toString()} ${contextBudgetCurrency}`
              : `0 ${contextBudgetCurrency}`,
        }));
        setXAxis(response.xAxis);
        setSeries(formattedSeries);
      } catch {
        setXAxis([]);
        setSeries([]);
      }
    };
    if (!contextBudgetId) {
      return;
    }
    loadDepositsResults();
  }, [contextBudgetId, displayValue, periodFrom, periodTo, deposit]);

  return (
    <Stack sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <FilterField
          options={DISPLAY_CHOICES}
          label="Display"
          filterValue={displayValue}
          setFilterValue={setDisplayValue}
          disableClearable
          sx={{ width: 160 }}
        />
        <FilterField
          options={depositChoices}
          label="Deposit"
          filterValue={deposit || ''}
          setFilterValue={setDeposit}
          sx={{ width: 160 }}
        />
        <FilterField
          options={periodChoices}
          label="Period from"
          filterValue={periodFrom || ''}
          setFilterValue={setPeriodFrom}
          sx={{ width: 160 }}
        />
        <FilterField
          options={periodChoices}
          label="Period to"
          filterValue={periodTo || ''}
          setFilterValue={setPeriodTo}
          sx={{ width: 160 }}
        />
      </Stack>
      <LineChart
        xAxis={[{ scaleType: 'band', data: xAxis }]}
        series={series}
        height={300}
        margin={{ bottom: 10 }}
        slotProps={{
          legend: {
            direction: 'horizontal',
            position: {
              vertical: 'bottom',
              horizontal: 'center',
            },
          },
        }}
      />
    </Stack>
  );
}
