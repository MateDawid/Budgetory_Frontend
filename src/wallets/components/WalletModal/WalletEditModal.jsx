import React, { useContext } from 'react';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { WalletContext } from '../../../app_infrastructure/store/WalletContext';
import { updateApiObject } from '../../../app_infrastructure/services/APIService';
import BaseWalletModal from './BaseWalletModal';

/**
 * WalletEditModal component for displaying edit  Wallet form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {object} [props.editedWallet] - Edited  Wallet object.
 * @param {function} [props.setEditedWallet] - Setter for editedWallet value.
 */
export default function WalletEditModal({
  apiUrl,
  formOpen,
  setFormOpen,
  editedWallet,
  setEditedWallet,
}) {
  const { updateRefreshTimestamp } = useContext(WalletContext);
  const { setAlert } = useContext(AlertContext);

  const callApi = async (data) => {
    data['id'] = editedWallet.id;
    const response = await updateApiObject(apiUrl, data);
    updateRefreshTimestamp();
    setEditedWallet(undefined);
    setAlert({
      type: 'success',
      message: 'Wallet updated successfully.',
    });
    return response;
  };

  return (
    <BaseWalletModal
      formOpen={formOpen}
      setFormOpen={setFormOpen}
      callApi={callApi}
      editedWallet={editedWallet}
    />
  );
}
