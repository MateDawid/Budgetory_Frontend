import React, { useContext } from 'react';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { WalletContext } from '../../../app_infrastructure/store/WalletContext';
import { createApiObject } from '../../../app_infrastructure/services/APIService';
import BaseEntityModal from './BaseEntityModal';
import { EntityTypes } from '../EntityDataGrid';

/**
 * EntityAddModal component for displaying add Entity form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {number} props.entityType - Type of Entity (Entity or Deposit)
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 */
export default function EntityAddModal({
  apiUrl,
  entityType,
  formOpen,
  setFormOpen,
}) {
  const { updateRefreshTimestamp } = useContext(WalletContext);
  const { setAlert } = useContext(AlertContext);

  const callApi = async (data) => {
    const response = await createApiObject(apiUrl, data);
    updateRefreshTimestamp();
    setAlert({
      type: 'success',
      message: `${entityType === EntityTypes.ENTITY ? 'Entity' : 'Deposit'} created successfully.`,
    });
    return response;
  };

  return (
    <BaseEntityModal
      entityType={entityType}
      formOpen={formOpen}
      setFormOpen={setFormOpen}
      callApi={callApi}
    />
  );
}
