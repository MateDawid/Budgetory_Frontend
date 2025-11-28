import React, { useContext } from 'react';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import { createApiObject } from '../../../app_infrastructure/services/APIService';
import BasePredictionModal from './BasePredictionModal';

/**
 * PredictionAddModal component for displaying add Prediction form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {string} props.periodId - Period ID.
 */
export default function PredictionAddModal({
  apiUrl,
  formOpen,
  setFormOpen,
  periodId,
}) {
  const { updateRefreshTimestamp } = useContext(BudgetContext);
  const { setAlert } = useContext(AlertContext);

  const callApi = async (data) => {
    data['period'] = periodId;
    const response = await createApiObject(apiUrl, data);
    updateRefreshTimestamp();
    setAlert({
      type: 'success',
      message: 'Expense Prediction created successfully.',
    });
    return response;
  };

  return (
    <BasePredictionModal
      formOpen={formOpen}
      setFormOpen={setFormOpen}
      callApi={callApi}
    />
  );
}
