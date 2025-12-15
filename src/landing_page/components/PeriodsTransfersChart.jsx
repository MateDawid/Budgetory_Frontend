import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { BudgetContext } from '../../app_infrastructure/store/BudgetContext';
import { BarChart } from '@mui/x-charts/BarChart';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';

/**
 * PeriodsTransfersChart component for displaying BarChart with accumulated Transfers in Periods.
 * @param {object} props
 * @param {function} [props.depositId] - Optional Deposit ID value.
 * @param {object} [props.periodsOnChart] - Optional number of Periods on Chart.
 */
export default function PeriodsTransfersChart({
  depositId = null,
  periodsOnChart = null,
}) {
  const { contextBudgetId, contextBudgetCurrency } = useContext(BudgetContext);
  // Chart data
  const [xAxis, setXAxis] = useState([]);
  const [expenseSeries, setExpenseSeries] = useState([]);
  const [incomeSeries, setIncomeSeries] = useState([]);

  const valueFormatter = (value) =>
    value
      ? `${value.toString()} ${contextBudgetCurrency}`
      : `0 ${contextBudgetCurrency}`;

  useEffect(() => {
    const loadDepositsResults = async () => {
      try {
        const filterModel = {};
        if (depositId) filterModel['deposit'] = depositId;
        if (periodsOnChart) filterModel['periods_count'] = periodsOnChart;
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/period_transfers_chart/`,
          {},
          {},
          filterModel
        );
        setXAxis(response.xAxis);
        setIncomeSeries(response.income_series);
        setExpenseSeries(response.expense_series);
      } catch {
        setXAxis([]);
        setIncomeSeries([]);
        setExpenseSeries([]);
      }
    };
    if (!contextBudgetId) {
      return;
    }
    loadDepositsResults();
  }, [contextBudgetId]);

  return (
    <BarChart
      xAxis={[{ data: xAxis }]}
      yAxis={[{ valueFormatter: (v) => v.toString() }]}
      height={300}
      series={[
        {
          data: expenseSeries,
          valueFormatter: valueFormatter,
          color: '#BD0000',
          label: 'Expenses',
        },
        {
          data: incomeSeries,
          valueFormatter: valueFormatter,
          color: '#008000',
          label: 'Incomes',
        },
      ]}
      slotProps={{
        legend: { direction: 'vertical' },
      }}
    />
  );
}
