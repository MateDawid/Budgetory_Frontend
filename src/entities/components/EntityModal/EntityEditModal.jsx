import React, { useContext } from 'react';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import { updateApiObject } from '../../../app_infrastructure/services/APIService';
import BaseEntityModal from './BaseEntityModal';

/**
 * EntityEditModal component for displaying edit Entity form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {object} [props.editedEntity] - Edited Entity object.
 * @param {function} [props.setEditedEntity] - Setter for editedEntity value.
 */
export default function EntityEditModal({
  apiUrl,
  formOpen,
  setFormOpen,
  editedEntity,
  setEditedEntity,
}) {
  const { updateRefreshTimestamp } = useContext(BudgetContext);
  const { setAlert } = useContext(AlertContext);

  const callApi = async (data) => {
    data['id'] = editedEntity.id;
    const response = await updateApiObject(apiUrl, data);
    updateRefreshTimestamp();
    setEditedEntity(undefined);
    setAlert({
      type: 'success',
      message: 'Entity updated successfully.',
    });
    return response;
  };

  return (
    <BaseEntityModal
      formOpen={formOpen}
      setFormOpen={setFormOpen}
      callApi={callApi}
      editedEntity={editedEntity}
    />
  );
}
