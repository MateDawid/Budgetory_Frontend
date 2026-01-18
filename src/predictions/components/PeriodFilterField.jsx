import { Autocomplete, Tooltip } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import StyledTextField from '../../app_infrastructure/components/StyledTextField';
import { WalletContext } from '../../app_infrastructure/store/WalletContext';

/**
 * SearchField component to display search field for list pages.
 * @param {object} props
 * @param {object[]} props.periodOptions - Array of Periods to be selected.
 * @param {*} props.periodFilter - Current value of Period filter
 * @returns {object|null} - Returns Period object if given ID belongs to Wallet. Null otherwise.
 */
const checkIfPeriodBelongsToWallet = (periodId, periodOptions) => {
  let matchingPeriod = null;
  periodOptions.forEach((period) => {
    if (period.id === periodId) {
      matchingPeriod = period;
      return;
    }
  });
  return matchingPeriod;
};

/**
 * SearchField component to display search field for list pages.
 * @param {object} props
 * @param {object[]} props.periodOptions - Array of Periods to be selected.
 * @param {*} props.periodFilter - Current value of Period filter
 * @param {Function} props.setPeriodFilter - Setter for Period filter value stored in page state.
 * @param {Function} props.setPeriodStatus - Setter for Period status value stored in page state.
 * @param {Function} props.setPeriodStatusLabel - Setter for Period status label stored in page state.
 */
const PeriodFilterField = ({
  periodOptions,
  periodFilter,
  setPeriodFilter,
  setPeriodStatus,
  setPeriodStatusLabel,
}) => {
  const { getContextWalletId } = useContext(WalletContext);
  const contextWalletId = getContextWalletId();

  useEffect(() => {
    const loadStoragePeriodFilter = () => {
      if (
        periodFilter &&
        checkIfPeriodBelongsToWallet(periodFilter, periodOptions)
      ) {
        return periodFilter;
      }
      const storagePeriodFilter = localStorage.getItem('budgetory.periodFilter')
        ? parseInt(localStorage.getItem('budgetory.periodFilter'), 10)
        : null;
      const storagePeriodObject = checkIfPeriodBelongsToWallet(
        storagePeriodFilter,
        periodOptions
      );
      if (storagePeriodObject) {
        setPeriodFilter(storagePeriodObject.id);
        setPeriodStatus(storagePeriodObject.status);
        setPeriodStatusLabel(storagePeriodObject.status_display);
        document.title = `Predictions • ${storagePeriodObject.name}`;
      } else if (periodOptions.length > 0) {
        setPeriodFilter(periodOptions[0].id);
        setPeriodStatus(periodOptions[0].status);
        setPeriodStatusLabel(periodOptions[0].status_display);
        localStorage.setItem('budgetory.periodFilter', periodOptions[0].id);
      } else {
        setPeriodFilter(null);
        setPeriodStatus(0);
        setPeriodStatusLabel(null);
      }
    };
    if (!contextWalletId) {
      return;
    }
    loadStoragePeriodFilter();
  }, [contextWalletId, periodOptions]);

  return (
    <Autocomplete
      disablePortal
      disableClearable
      options={periodOptions}
      value={periodOptions.find((option) => option.id === periodFilter) || null}
      onChange={(e, selectedOption) => {
        if (selectedOption === null) {
          setPeriodFilter(null);
          setPeriodStatus(null);
          setPeriodStatus(null);
          document.title = 'Predictions';
          localStorage.removeItem('budgetory.periodFilter');
        } else {
          setPeriodFilter(selectedOption.id);
          setPeriodStatus(selectedOption.status);
          setPeriodStatusLabel(selectedOption.status_display);
          document.title = `Predictions • ${selectedOption.name}`;
          localStorage.setItem('budgetory.periodFilter', selectedOption.value);
        }
      }}
      sx={{ minWidth: 100, maxWidth: 200 }}
      renderInput={(params) => {
        return (
          <Tooltip
            title={
              params.inputProps.value ? params.inputProps.value : undefined
            }
            placement="top"
          >
            <StyledTextField
              {...params}
              label={'Period'}
              sx={{ marginBottom: 1, minWidth: 150 }}
            />
          </Tooltip>
        );
      }}
    />
  );
};

export default PeriodFilterField;
