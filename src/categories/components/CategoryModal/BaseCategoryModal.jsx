import React, { useContext, useEffect, useState } from 'react';
import FormModal from '../../../app_infrastructure/components/FormModal/FormModal';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import { getApiObjectsList } from '../../../app_infrastructure/services/APIService';

/**
 * BaseCategoryModal component for displaying Category form for adding and editing.
 * @param {object} props
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {function} props.callApi - Function to be called on form submit.
 * @param {object | undefined} [props.editedCategory] - Edited Category object.
 */
export default function BaseCategoryModal({
  formOpen,
  setFormOpen,
  callApi,
  editedCategory = undefined,
}) {
  const { contextBudgetId } = useContext(BudgetContext);

  // Selectables
  const [depositOptions, setDepositOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);

  const fields = {
    name: {
      type: 'string',
      label: 'Name',
      autoFocus: true,
      required: true,
    },
    deposit: {
      type: 'select',
      select: true,
      label: 'Deposit',
      required: true,
      options: depositOptions,
    },
    category_type: {
      type: 'select',
      select: true,
      label: 'Type',
      required: true,
      options: typeOptions,
    },
    priority: {
      type: 'select',
      select: true,
      label: 'Priority',
      required: true,
      options: priorityOptions,
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
   * Fetches select options for Category select fields from API.
   */
  useEffect(() => {
    async function getDeposits() {
      const response = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`
      );
      setDepositOptions(response);
    }
    async function getCategoryTypes() {
      const typeResponse = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/categories/types`
      );
      setTypeOptions(typeResponse.results);
    }
    async function getPriorities() {
      const priorityResponse = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/categories/priorities`
      );
      setPriorityOptions(priorityResponse.results);
    }

    if (!contextBudgetId || !formOpen) return;
    getDeposits();
    getCategoryTypes();
    getPriorities();
  }, [contextBudgetId]);

  return (
    <>
      <FormModal
        fields={fields}
        formLabel={`${editedCategory ? 'Edit' : 'Add'} Category`}
        open={formOpen}
        setOpen={setFormOpen}
        callApi={callApi}
        updatedObject={editedCategory}
      />
    </>
  );
}
