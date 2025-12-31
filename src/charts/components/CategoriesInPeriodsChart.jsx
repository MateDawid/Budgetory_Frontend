import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { BudgetContext } from '../../app_infrastructure/store/BudgetContext';
import FilterField from '../../app_infrastructure/components/FilterField';
import CategoryTypes from '../../categories/utils/CategoryTypes';
import { LandingPageContext } from '../../app_infrastructure/store/LandingPageContext';

const CATEGORY_TYPE_CHOICES = [
  { label: 'Expenses', value: CategoryTypes.EXPENSE },
  { label: 'Incomes', value: CategoryTypes.INCOME },
];

export default function CategoriesInPeriodsChart() {
  const { contextBudgetId, contextBudgetCurrency } = useContext(BudgetContext);
  const { periodChoices, depositChoices } = useContext(LandingPageContext);

  // Filters values
  const [periodFrom, setPeriodFrom] = useState();
  const [periodTo, setPeriodTo] = useState();
  const [categoryType, setCategoryType] = useState(CategoryTypes.EXPENSE);
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
        { value: deposit, apiField: 'deposit' },
        { value: categoryType, apiField: 'category_type' },
      ];
      selectFilters.forEach((object) => {
        if (object.value) {
          filterModel[[object.apiField]] = object.value;
        }
      });

      return filterModel;
    };
    const loadCategoriesResults = async () => {
      try {
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/charts/categories_in_periods/`,
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
    loadCategoriesResults();
  }, [contextBudgetId, periodFrom, periodTo, categoryType, deposit]);

  return (
    <Stack sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <FilterField
          filterValue={categoryType}
          setFilterValue={setCategoryType}
          options={CATEGORY_TYPE_CHOICES}
          label="Transfer Type"
          sx={{ width: 160 }}
          disableClearable
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
