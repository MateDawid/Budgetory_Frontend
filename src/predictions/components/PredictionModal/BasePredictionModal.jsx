import React, { useContext, useEffect, useState } from 'react';
import FormModal from '../../../app_infrastructure/components/FormModal/FormModal';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
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
  const { contextBudgetId, contextBudgetCurrency, refreshTimestamp } =
    useContext(BudgetContext);

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
    },
    category: {
      type: 'select',
      select: true,
      label: 'Category',
      required: true,
      options: categories,
      groupBy: (option) => option.priority_display,
      disabled: !selectedDeposit,
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
              {contextBudgetCurrency}
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
        `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/?ordering=deposit_type,name`
      );
      setDeposits(response);
    }
    if (!contextBudgetId) {
      return;
    }
    getDeposits();
  }, [contextBudgetId, refreshTimestamp]);

  /**
   * Fetches select options for Transfer categories object from API.
   */
  useEffect(() => {
    async function getCategories() {
      const filterModel = {
        category_type: CategoryTypes.EXPENSE,
        ordering: 'priority',
      };
      if (selectedDeposit) {
        filterModel['deposit'] = selectedDeposit;
      }
      const response = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/`,
        {},
        {},
        filterModel
      );
      setCategories(response);
    }
    if (!contextBudgetId || !selectedDeposit) {
      return;
    }
    getCategories();
  }, [contextBudgetId, selectedDeposit]);

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
