import React, { useContext } from 'react';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import { updateApiObject } from '../../../app_infrastructure/services/APIService';
import BaseCategoryModal from './BaseCategoryModal';

/**
 * CategoryEditModal component for displaying edit Category form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {object} [props.editedCategory] - Edited Category object.
 * @param {function} [props.setEditedCategory] - Setter for editedCategory value.
 */
export default function CategoryEditModal({
  apiUrl,
  formOpen,
  setFormOpen,
  editedCategory,
  setEditedCategory,
}) {
  const { updateRefreshTimestamp } = useContext(BudgetContext);
  const { setAlert } = useContext(AlertContext);

  const callApi = async (data) => {
    data['id'] = editedCategory.id;
    const response = await updateApiObject(apiUrl, data);
    updateRefreshTimestamp();
    setEditedCategory(undefined);
    setAlert({
      type: 'success',
      message: 'Category updated successfully.',
    });
    return response;
  };

  return (
    <BaseCategoryModal
      formOpen={formOpen}
      setFormOpen={setFormOpen}
      callApi={callApi}
      editedCategory={editedCategory}
    />
  );
}
