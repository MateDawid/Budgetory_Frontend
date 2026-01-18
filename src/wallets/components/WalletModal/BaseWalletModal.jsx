import React, { useEffect, useState } from 'react';
import FormModal from '../../../app_infrastructure/components/FormModal/FormModal';
import { getApiObjectsList } from '../../../app_infrastructure/services/APIService';

/**
 * BaseWalletModal component for displaying  Wallet form for adding and editing.
 * @param {object} props
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {function} props.callApi - Function to be called on form submit.
 * @param {object | undefined} [props.editedWallet] - Edited  Wallet object.
 */
export default function BaseWalletModal({
  formOpen,
  setFormOpen,
  callApi,
  editedWallet = undefined,
}) {
  const [currencies, setCurrencies] = useState([]);

  const fields = {
    name: {
      type: 'string',
      label: 'Name',
      autoFocus: true,
      required: true,
    },
    description: {
      type: 'string',
      label: 'Description',
      multiline: true,
      rows: 4,
    },
    currency: {
      type: 'select',
      select: true,
      label: 'Currency',
      options: currencies,
    },
  };

  /**
   * Fetches select options for Wallet currency from API.
   */
  useEffect(() => {
    async function getCurrencies() {
      const response = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/currencies/`
      );
      setCurrencies(response);
    }
    if (!formOpen) return;
    getCurrencies();
  }, [formOpen]);

  return (
    <FormModal
      fields={fields}
      formLabel={`${editedWallet ? 'Edit' : 'Add'} Wallet`}
      open={formOpen}
      setOpen={setFormOpen}
      callApi={callApi}
      updatedObject={editedWallet}
    />
  );
}
