import React, { useContext } from 'react';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import { createApiObject } from '../../../app_infrastructure/services/APIService';
import TransferTypes from '../../utils/TransferTypes';
import BaseTransferModal from './BaseTransferModal';

/**
 * TransferAddModal component for displaying add Transfer form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {number} props.transferType - Type of Transfer. Options: TransferTypes.INCOME, TransferTypes.EXPENSE.
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 */
export default function TransferAddModal({
  apiUrl,
  transferType,
  formOpen,
  setFormOpen,
}) {
  const { updateRefreshTimestamp } = useContext(BudgetContext);
  const { setAlert } = useContext(AlertContext);

  const callApi = async (data) => {
    const response = await createApiObject(apiUrl, data);
    updateRefreshTimestamp();
    setAlert({
      type: 'success',
      message: `${transferType === TransferTypes.EXPENSE ? 'Expense' : 'Income'} created successfully.`,
    });
    return response;
  };

  return (
    <BaseTransferModal
      transferType={transferType}
      formOpen={formOpen}
      setFormOpen={setFormOpen}
      callApi={callApi}
    />
  );
}
