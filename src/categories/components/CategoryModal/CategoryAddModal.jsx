import React, { useContext } from 'react';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import { createApiObject } from '../../../app_infrastructure/services/APIService';
import BaseCategoryModal from './BaseCategoryModal';

/**
 * CategoryAddModal component for displaying add Category form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 */
export default function CategoryAddModal({ apiUrl, formOpen, setFormOpen }) {
  const { updateRefreshTimestamp } = useContext(BudgetContext);
  const { setAlert } = useContext(AlertContext);

  const callApi = async (data) => {
    const response = await createApiObject(apiUrl, data);
    updateRefreshTimestamp();
    setAlert({
      type: 'success',
      message: 'Category created successfully.',
    });
    return response;
  };

  return (
    <BaseCategoryModal
      formOpen={formOpen}
      setFormOpen={setFormOpen}
      callApi={callApi}
    />
  );
}
