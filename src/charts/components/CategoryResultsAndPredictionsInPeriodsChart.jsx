import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { WalletContext } from '../../app_infrastructure/store/WalletContext';
import { BarChart } from '@mui/x-charts/BarChart';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { Stack } from '@mui/material';
import FilterField from '../../app_infrastructure/components/FilterField';
import CategoryTypes from '../../categories/utils/CategoryTypes';

const DisplayValues = {
  RESULTS: 1,
  PREDICTIONS: 2,
};

const DISPLAY_VALUE_CHOICES = [
  { label: 'All', value: null },
  { label: 'Results', value: DisplayValues.RESULTS },
  { label: 'Predictions', value: DisplayValues.PREDICTIONS },
];

const PERIODS_ON_CHART = [
  { label: '3', value: 3 },
  { label: '6', value: 6 },
  { label: '9', value: 9 },
  { label: '12', value: 12 },
  { label: '24', value: 24 },
  { label: 'All', value: null },
];

/**
 * CategoryResultsAndPredictionsInPeriodsChart component for displaying BarChart with accumulated Transfers in Periods.
 * @param {object} props
 * @param {string} props.categoryId - Transfer Category ID value.
 * @param {number} props.categoryType - Type of Transfer Category (Expense or Income)
 */
export default function CategoryResultsAndPredictionsInPeriodsChart({
  categoryId,
  categoryType,
}) {
  const { contextWalletId, contextWalletCurrency } = useContext(WalletContext);
  // Filters values
  const [displayValue, setDisplayValue] = useState(null);
  const [periodsOnChart, setPeriodsOnChart] = useState(12);
  // Chart data
  const [xAxis, setXAxis] = useState([]);
  const [series, setSeries] = useState([]);

  const valueFormatter = (value) =>
    value
      ? `${value.toString()} ${contextWalletCurrency}`
      : `0 ${contextWalletCurrency}`;

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const filterModel = {};
        if (categoryId) filterModel['category'] = categoryId;
        if (categoryType === CategoryTypes.INCOME)
          filterModel['display_value'] = DisplayValues.RESULTS;
        if (displayValue) filterModel['display_value'] = displayValue;
        if (periodsOnChart) filterModel['periods_count'] = periodsOnChart;
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/charts/category_results_and_predictions_in_periods/`,
          {},
          {},
          filterModel
        );
        setXAxis(response.xAxis);
        const responseSeries = [];
        if (displayValue === null || displayValue === DisplayValues.RESULTS) {
          responseSeries.push({
            data: response.results_series,
            valueFormatter: valueFormatter,
            color:
              categoryType === CategoryTypes.INCOME ? '#008000' : '#BD0000',
            label: 'Results',
          });
        }
        if (
          categoryType !== CategoryTypes.INCOME &&
          (displayValue === null || displayValue === DisplayValues.PREDICTIONS)
        ) {
          responseSeries.push({
            data: response.predictions_series,
            valueFormatter: valueFormatter,
            color: '#500000',
            label: 'Predictions',
          });
        }
        setSeries(responseSeries);
      } catch {
        setXAxis([]);
        setSeries([]);
      }
    };
    if (!contextWalletId || !categoryId || !categoryType) {
      return;
    }
    loadChartData();
  }, [contextWalletId, displayValue, periodsOnChart, categoryId, categoryType]);

  return (
    <Stack sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {categoryType !== CategoryTypes.INCOME && (
          <FilterField
            options={DISPLAY_VALUE_CHOICES}
            label="Display value"
            filterValue={displayValue}
            setFilterValue={setDisplayValue}
            disableClearable
            sx={{ width: 160 }}
          />
        )}
        <FilterField
          options={PERIODS_ON_CHART}
          label="Periods on chart"
          filterValue={periodsOnChart}
          setFilterValue={setPeriodsOnChart}
          disableClearable
          sx={{ width: 160 }}
        />
      </Stack>
      <BarChart
        xAxis={[{ data: xAxis }]}
        yAxis={[{ valueFormatter: (v) => v.toString() }]}
        height={300}
        series={series}
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
