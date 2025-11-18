import React, { useContext, useState } from 'react';
import { Add as AddIcon } from '@mui/icons-material';
import StyledButton from './StyledButton';
import { createApiObject } from '../services/APIService';
import { AlertContext } from '../store/AlertContext';
import FormModal from './FormModal/FormModal';

/**
 * CreateButton component to display Modal with form for creating new object.
 * @param {object} fields - Create form fields.
 * @param {string} apiUrl - Base API url to be called with POST method.
 * @param {string} objectType - Type of created object.
 * @param {function} customSetAlert - Custom setAlert function.
 * @param {string} customLabel - Custom label for Button.
 * @param {boolean} disabled - Indicates if CreateButton is disabled.
 */
const CreateButton = ({
  fields,
  apiUrl,
  objectType,
  customSetAlert = undefined,
  customLabel = undefined,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const { setAlert: contextSetAlert } = useContext(AlertContext);
  const setAlert = customSetAlert || contextSetAlert;

  const prepareApiInput = (formData) => {
    const prefixedValues = Object.keys(fields).reduce(
      (reducedFields, fieldName) => {
        if (fields[fieldName].prefixedValue) {
          reducedFields[fieldName] = fields[fieldName].prefixedValue;
        }
        return reducedFields;
      },
      {}
    );
    if (prefixedValues) {
      return {
        ...formData,
        ...prefixedValues,
      };
    }
    return formData;
  };

  const callApi = async (formData) => {
    const apiInput = prepareApiInput(formData);
    return await createApiObject(apiUrl, apiInput);
  };

  return (
    <>
      <StyledButton
        onClick={() => setOpen(true)}
        variant="outlined"
        startIcon={<AddIcon />}
        disabled={disabled}
      >
        {customLabel ? customLabel : 'Add'}
      </StyledButton>
      <FormModal
        fields={fields}
        objectType={objectType}
        open={open}
        setOpen={setOpen}
        callApi={callApi}
        setAlert={setAlert}
      />
    </>
  );
};

export default CreateButton;
