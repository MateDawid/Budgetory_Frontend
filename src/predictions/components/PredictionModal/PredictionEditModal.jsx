import React, { useContext } from 'react';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import { updateApiObject } from '../../../app_infrastructure/services/APIService';
import BasePredictionModal from './BasePredictionModal';

/**
 * PredictionEditModal component for displaying edit Prediction form.
 * @param {object} props
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {object} props.editedPrediction - Edited Prediction object.
 */
export default function PredictionEditModal({
  formOpen,
  setFormOpen,
  editedPrediction,
}) {
  const { contextBudgetId, updateRefreshTimestamp } = useContext(BudgetContext);
  const { setAlert } = useContext(AlertContext);
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expense_predictions/`;

  const callApi = async (data) => {
    data['id'] = editedPrediction.id;
    delete data.category;
    const response = await updateApiObject(apiUrl, data);
    updateRefreshTimestamp();
    setAlert({
      type: 'success',
      message: `Expense Prediction updated successfully.`,
    });
    return response;
  };

  return (
    <BasePredictionModal
      formOpen={formOpen}
      setFormOpen={setFormOpen}
      callApi={callApi}
      editedPrediction={editedPrediction}
    />
  );
}
