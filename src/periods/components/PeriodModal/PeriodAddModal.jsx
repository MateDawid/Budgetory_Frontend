import React, { useContext } from 'react';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { WalletContext } from '../../../app_infrastructure/store/WalletContext';
import { createApiObject } from '../../../app_infrastructure/services/APIService';
import BasePeriodModal from './BasePeriodModal';

/**
 * PeriodAddModal component for displaying add Transfer form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 */
export default function PeriodAddModal({ apiUrl, formOpen, setFormOpen }) {
  const { updateRefreshTimestamp } = useContext(WalletContext);
  const { setAlert } = useContext(AlertContext);

  const callApi = async (data) => {
    const response = await createApiObject(apiUrl, data);
    updateRefreshTimestamp();
    setAlert({
      type: 'success',
      message: 'Period created successfully.',
    });
    return response;
  };

  return (
    <BasePeriodModal
      formOpen={formOpen}
      setFormOpen={setFormOpen}
      callApi={callApi}
    />
  );
}
