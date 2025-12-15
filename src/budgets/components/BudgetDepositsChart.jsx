import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { BudgetContext } from '../../app_infrastructure/store/BudgetContext';
import FilterField from '../../app_infrastructure/components/FilterField';

export default function BudgetDepositsChart() {
  const { contextBudgetId, contextBudgetCurrency } = useContext(BudgetContext);

  // Selectors choices
  const [periods, setPeriods] = useState([]);
  const [depositTypes, setDepositTypes] = useState([]);
  const [deposits, setDeposits] = useState([]);
  // Filters values
  const [periodFrom, setPeriodFrom] = useState();
  const [periodTo, setPeriodTo] = useState();
  const [depositType, setDepositType] = useState();
  const [deposit, setDeposit] = useState();
  // Chart data
  const [xAxis, setXAxis] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const loadPeriodsChoices = async () => {
      try {
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods/`
        );
        setPeriods(response);
      } catch {
        setPeriods([]);
      }
    };
    const loadDepositTypesChoices = async () => {
      try {
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/entities/deposit_types/`
        );
        setDepositTypes(response.results);
      } catch {
        setDepositTypes([]);
      }
    };
    const loadDepositsChoices = async () => {
      try {
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`
        );
        setDeposits(response);
      } catch {
        setDeposits([]);
      }
    };
    if (!contextBudgetId) {
      return;
    }
    loadPeriodsChoices();
    loadDepositTypesChoices();
    loadDepositsChoices();
  }, [contextBudgetId]);

  useEffect(() => {
    const getFilterModel = () => {
      const filterModel = {};
      const selectFilters = [
        { value: periodFrom, apiField: 'period_from' },
        { value: periodTo, apiField: 'period_to' },
        { value: depositType, apiField: 'deposit_type' },
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
          `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits_results/`,
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
  }, [contextBudgetId, periodFrom, periodTo, depositType, deposit]);

  return (
    <Stack sx={{ width: '100%' }}>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" spacing={1}>
          <FilterField
            options={periods}
            label="Period from"
            filterValue={periodFrom || ''}
            setFilterValue={setPeriodFrom}
            sx={{ minWidth: 200 }}
          />
          <FilterField
            options={periods}
            label="Period to"
            filterValue={periodTo || ''}
            setFilterValue={setPeriodTo}
            sx={{ minWidth: 200 }}
          />
        </Stack>
        <Stack direction="row" spacing={1}>
          <FilterField
            options={depositTypes}
            label="Deposit type"
            filterValue={depositType || ''}
            setFilterValue={setDepositType}
            sx={{ minWidth: 250 }}
          />
          <FilterField
            options={deposits}
            label="Deposit"
            filterValue={deposit || ''}
            setFilterValue={setDeposit}
            sx={{ minWidth: 250 }}
          />
        </Stack>
      </Stack>

      <LineChart
        xAxis={[{ scaleType: 'band', data: xAxis }]}
        series={series}
        height={300}
        margin={{ bottom: 10 }}
      />
    </Stack>
  );
}
