import React, { useContext } from 'react';
import FormModal from '../../app_infrastructure/components/FormModal/FormModal';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import { createApiObject } from '../../app_infrastructure/services/APIService';

/**
 * EntityAddModal component for displaying add Entity form.
 * @param {object} props
 * @param {string} props.apiUrl - URL to be called on form submit.
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {function} [props.onSuccess] - Optional function performed on form submit success.
 */
export default function EntityAddModal({
  apiUrl,
  formOpen,
  setFormOpen,
  onSuccess = undefined,
}) {
  const { setAlert } = useContext(AlertContext);

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
      required: false,
      multiline: true,
      rows: 4,
    },
    is_active: {
      type: 'select',
      select: true,
      label: 'Status',
      defaultValue: true,
      required: true,
      options: [
        {
          value: true,
          label: '🟢 Active',
        },
        {
          value: false,
          label: '🔴 Inactive',
        },
      ],
    },
  };

  const callApi = async (data) => {
    const response = await createApiObject(apiUrl, data);
    if (onSuccess) onSuccess();
    setAlert({ type: 'success', message: `Entity created successfully.` });
    return response;
  };

  return (
    <FormModal
      fields={fields}
      formLabel="Add Entity"
      open={formOpen}
      setOpen={setFormOpen}
      callApi={callApi}
    />
  );
}
