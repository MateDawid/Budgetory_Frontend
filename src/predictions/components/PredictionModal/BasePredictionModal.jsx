import React, { useContext, useEffect, useState } from 'react';
import FormModal from '../../../app_infrastructure/components/FormModal/FormModal';
import { WalletContext } from '../../../app_infrastructure/store/WalletContext';
import { getApiObjectsList } from '../../../app_infrastructure/services/APIService';
import { InputAdornment } from '@mui/material';
import CategoryTypes from '../../../categories/utils/CategoryTypes';

/**
 * BasePredictionModal component for displaying Expense Prediction form for adding and editing.
 * @param {object} props
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {function} props.callApi - Function to be called on form submit.
 * @param {object | undefined} [props.editedPrediction] - Edited Prediction object.
 */
export default function BasePredictionModal({
  formOpen,
  setFormOpen,
  callApi,
  editedPrediction = undefined,
}) {
  const { contextWalletId, contextWalletCurrency, refreshTimestamp } =
    useContext(WalletContext);

  // Selectables
  const [categories, setCategories] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);

  const fields = {
    deposit: {
      type: 'select',
      select: true,
      label: 'Deposit',
      required: true,
      options: deposits,
      groupBy: (option) => option.deposit_type_display,
      onChange: (value) => setSelectedDeposit(value),
      clearFieldsOnChange: ['category'],
      disabled: editedPrediction,
    },
    category: {
      type: 'select',
      select: true,
      label: 'Category',
      required: true,
      options: categories,
      groupBy: (option) => option.priority_display,
      disabled: editedPrediction || !selectedDeposit,
    },
    current_plan: {
      type: 'number',
      step: 'any',
      label: 'Value',
      required: true,
      slotProps: {
        input: {
          endAdornment: (
            <InputAdornment position="end">
              {contextWalletCurrency}
            </InputAdornment>
          ),
        },
        htmlInput: {
          step: 0.01,
          min: 0,
        },
      },
    },
    description: {
      type: 'string',
      label: 'Description',
      required: false,
      multiline: true,
      rows: 4,
    },
  };

  /**
   * Updates selectedDeposit state depending on passed Prediction.
   */
  useEffect(() => {
    if (editedPrediction) setSelectedDeposit(editedPrediction.deposit);
    else setSelectedDeposit(null);
  }, [editedPrediction]);

  /**
   * Fetches select options for Transfer deposits objects from API.
   */
  useEffect(() => {
    async function getDeposits() {
      const response = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/deposits/?ordering=deposit_type,name`
      );
      setDeposits(response);
    }
    if (!contextWalletId) {
      return;
    }
    if (!contextWalletId || !formOpen) return;
    getDeposits();
  }, [contextWalletId, refreshTimestamp, formOpen]);

  /**
   * Fetches select options for Transfer categories object from API.
   */
  useEffect(() => {
    async function getCategories() {
      console.log('getCategories');
      const filterModel = {
        category_type: CategoryTypes.EXPENSE,
        ordering: 'priority',
      };
      if (selectedDeposit) {
        filterModel['deposit'] = selectedDeposit;
      }
      const response = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/categories/`,
        {},
        {},
        filterModel
      );
      setCategories(response);
    }
    if (!contextWalletId || !formOpen || !selectedDeposit) return;
    getCategories();
  }, [contextWalletId, selectedDeposit, formOpen]);

  return (
    <FormModal
      fields={fields}
      formLabel={`${editedPrediction ? 'Edit' : 'Add'} Expense Prediction`}
      open={formOpen}
      setOpen={setFormOpen}
      callApi={callApi}
      updatedObject={editedPrediction}
    />
  );
}
