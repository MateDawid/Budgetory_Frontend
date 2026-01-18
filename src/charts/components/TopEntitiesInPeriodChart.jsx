import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { WalletContext } from '../../app_infrastructure/store/WalletContext';
import { BarChart } from '@mui/x-charts/BarChart';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { Stack } from '@mui/material';
import FilterField from '../../app_infrastructure/components/FilterField';
import CategoryTypes from '../../categories/utils/CategoryTypes';
import { DepositChoicesContext } from '../../app_infrastructure/store/DepositChoicesContext';
import { PeriodChoicesContext } from '../../app_infrastructure/store/PeriodChoicesContext';

const TRANSFER_TYPES = [
  { label: 'Expenses', value: CategoryTypes.EXPENSE },
  { label: 'Incomes', value: CategoryTypes.INCOME },
];
const ENTITIES_ON_CHART = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '30', value: 30 },
];

/**
 * TopEntitiesInPeriodChart component for displaying top Entities in given Period on Bar chart.
 * @param {object} props
 * @param {string} [props.periodId] - Optional Period ID value.
 */
export default function TopEntitiesInPeriodChart({ periodId = null }) {
  const { getContextWalletId, contextWalletCurrency } =
    useContext(WalletContext);
  const contextWalletId = getContextWalletId();
  const { depositChoices } = useContext(DepositChoicesContext);
  const { periodChoices } = useContext(PeriodChoicesContext);

  // Filters values
  const [transferType, setTransferType] = useState(CategoryTypes.EXPENSE);
  const [entitiesOnChart, setEntitiesOnChart] = useState(5);
  const [period, setPeriod] = useState(null);
  const [deposit, setDeposit] = useState(null);
  // Chart data
  const [xAxis, setXAxis] = useState([]);
  const [series, setSeries] = useState([]);

  const valueFormatter = (value) =>
    value
      ? `${value.toString()} ${contextWalletCurrency}`
      : `0 ${contextWalletCurrency}`;

  /**
   * Set initial value for Period filter.
   */
  useEffect(() => {
    if (!periodId && periodChoices.length > 0) setPeriod(periodChoices[0].id);
  }, [periodChoices]);

  useEffect(() => {
    const loadEntitiesResults = async () => {
      try {
        const filterModel = {};
        if (periodId) filterModel['period'] = periodId;
        if (period) filterModel['period'] = period;
        if (deposit) filterModel['deposit'] = deposit;
        if (transferType) filterModel['transfer_type'] = transferType;
        if (entitiesOnChart) filterModel['entities_count'] = entitiesOnChart;
        const response = await getApiObjectsList(
          `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/charts/top_entities_in_period/`,
          {},
          {},
          filterModel
        );
        setXAxis(response.xAxis);
        setSeries([
          {
            data: response.series,
            valueFormatter: valueFormatter,
            color:
              transferType === CategoryTypes.INCOME ? '#008000' : '#BD0000',
          },
        ]);
      } catch {
        setXAxis([]);
        setSeries([]);
      }
    };
    if (!contextWalletId || (!periodId && !period)) {
      return;
    }
    loadEntitiesResults();
  }, [contextWalletId, transferType, entitiesOnChart, period, deposit]);

  return (
    <Stack sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <FilterField
          options={TRANSFER_TYPES}
          label="Transfer type"
          filterValue={transferType}
          setFilterValue={setTransferType}
          disableClearable
          sx={{ width: 160 }}
        />
        <FilterField
          options={ENTITIES_ON_CHART}
          label="Entities on chart"
          filterValue={entitiesOnChart}
          setFilterValue={setEntitiesOnChart}
          disableClearable
          sx={{ width: 160 }}
        />
        {!periodId && (
          <FilterField
            options={periodChoices}
            label="Period"
            filterValue={period}
            setFilterValue={setPeriod}
            disableClearable
            sx={{ width: 160 }}
          />
        )}
        <FilterField
          options={depositChoices}
          label="Deposit"
          filterValue={deposit}
          setFilterValue={setDeposit}
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
