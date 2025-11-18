import React, { useContext } from 'react';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import { updateApiObject } from '../../../app_infrastructure/services/APIService';
import TransferTypes from '../../utils/TransferTypes';
import BaseTransferModal from './BaseTransferModal';

/**
 * TransferEditModal component for displaying edit Transfer form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {number} props.transferType - Type of Transfer. Options: TransferTypes.INCOME, TransferTypes.EXPENSE.
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {object} [props.editedTransfer] - Edited Transfer object.
 * @param {function} [props.setEditedTransfer] - Setter for editedTransfer value.
 */
export default function TransferEditModal({
  apiUrl,
  transferType,
  formOpen,
  setFormOpen,
  editedTransfer,
  setEditedTransfer,
}) {
  const { updateRefreshTimestamp } = useContext(BudgetContext);
  const { setAlert } = useContext(AlertContext);

  const callApi = async (data) => {
    data['id'] = editedTransfer.id;
    const response = await updateApiObject(apiUrl, data);
    updateRefreshTimestamp();
    setEditedTransfer(undefined);
    setAlert({
      type: 'success',
      message: `${transferType === TransferTypes.EXPENSE ? 'Expense' : 'Income'} updated successfully.`,
    });
    return response;
  };

  return (
    <BaseTransferModal
      transferType={transferType}
      formOpen={formOpen}
      setFormOpen={setFormOpen}
      callApi={callApi}
      editedTransfer={editedTransfer}
    />
  );
}
