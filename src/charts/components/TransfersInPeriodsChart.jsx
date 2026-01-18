import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { WalletContext } from '../../app_infrastructure/store/WalletContext';
import { BarChart } from '@mui/x-charts/BarChart';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';
import { Stack } from '@mui/material';
import FilterField from '../../app_infrastructure/components/FilterField';
import CategoryTypes from '../../categories/utils/CategoryTypes';
import { EntityChoicesContext } from '../../app_infrastructure/store/EntityChoicesContext';
import { DepositChoicesContext } from '../../app_infrastructure/store/DepositChoicesContext';

const TRANSFER_TYPES = [
  { label: 'All', value: null },
  { label: 'Incomes', value: CategoryTypes.INCOME },
  { label: 'Expenses', value: CategoryTypes.EXPENSE },
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
 * TransfersInPeriodsChart component for displaying BarChart with accumulated Transfers in Periods.
 * @param {object} props
 * @param {string} [props.depositId] - Optional Deposit ID value.
 * @param {string} [props.entityId] - Optional Entity ID value.
 */
export default function TransfersInPeriodsChart({
  depositId = null,
  entityId = null,
}) {
  const { getContextWalletId, contextWalletCurrency } =
    useContext(WalletContext);
  const contextWalletId = getContextWalletId();
  const { depositChoices } = useContext(DepositChoicesContext);
  const { entityChoices } = useContext(EntityChoicesContext);

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
      ? `${value.toString()} ${contextWalletCurrency}`
      : `0 ${contextWalletCurrency}`;

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
          `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/charts/transfers_in_periods/`,
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
    if (!contextWalletId) {
      return;
    }
    loadDepositsResults();
  }, [contextWalletId, transferType, periodsOnChart, deposit, entity]);

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
          options={PERIODS_ON_CHART}
          label="Periods on chart"
          filterValue={periodsOnChart}
          setFilterValue={setPeriodsOnChart}
          disableClearable
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
