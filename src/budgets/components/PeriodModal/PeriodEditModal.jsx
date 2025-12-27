import React, { useContext } from 'react';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import { updateApiObject } from '../../../app_infrastructure/services/APIService';
import BasePeriodModal from './BasePeriodModal';

/**
 * PeriodEditModal component for displaying edit BudgetingPeriod form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {object} [props.editedPeriod] - Edited BudgetingPeriod object.
 * @param {function} [props.setEditedPeriod] - Setter for editedPeriod value.
 */
export default function PeriodEditModal({
  apiUrl,
  formOpen,
  setFormOpen,
  editedPeriod,
  setEditedPeriod,
}) {
  const { updateRefreshTimestamp } = useContext(BudgetContext);
  const { setAlert } = useContext(AlertContext);

  const callApi = async (data) => {
    data['id'] = editedPeriod.id;
    const response = await updateApiObject(apiUrl, data);
    updateRefreshTimestamp();
    setEditedPeriod(undefined);
    setAlert({
      type: 'success',
      message: 'Period updated successfully.',
    });
    return response;
  };

  return (
    <BasePeriodModal
      formOpen={formOpen}
      setFormOpen={setFormOpen}
      callApi={callApi}
      editedPeriod={editedPeriod}
    />
  );
}
